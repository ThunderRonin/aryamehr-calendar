import { test } from "node:test";
import assert from "node:assert/strict";
import { createSettingsPageConfig } from "../src/setting/settings-config";

type TreeNode = {
  type: string;
  props: Record<string, unknown>;
  children?: any[];
};

class SettingsStorage {
  private values = new Map<string, string>();

  getItem(key: string): string | null {
    return this.values.get(key) ?? null;
  }

  setItem(key: string, value: string): void {
    this.values.set(key, String(value));
  }
}

const factory = (type: string) => (props: Record<string, unknown> = {}, children: any[] = []) => ({
  type,
  props,
  children,
});

(globalThis as any).View = factory("View");
(globalThis as any).Section = factory("Section");
(globalThis as any).Text = factory("Text");
(globalThis as any).TextInput = (props: Record<string, unknown>) => ({
  type: "TextInput",
  props,
});
(globalThis as any).TextImageRow = (props: Record<string, unknown>) => ({
  type: "TextImageRow",
  props,
});
(globalThis as any).Button = (props: Record<string, unknown>) => ({
  type: "Button",
  props,
});

function sectionTitle(section: TreeNode): string {
  return String(section.props.title);
}

function walk(node: TreeNode): TreeNode[] {
  return [
    node,
    ...(node.children ?? [])
      .filter((child): child is TreeNode => typeof child === "object" && child !== null)
      .flatMap(walk),
  ];
}

function assertNoEmoji(value: string, context: string): void {
  assert.doesNotMatch(value, /[\u{1F300}-\u{1FAFF}]/u, `${context} contains an emoji label`);
}

function textChildren(section: TreeNode): string[] {
  return (section.children ?? []).flatMap((child) =>
    typeof child === "object" && child !== null
      ? (child.children ?? []).filter((value: unknown): value is string => typeof value === "string")
      : []
  );
}

test("settings tree presents the feed, sync, manual event, and guide sections in order", () => {
  const page = createSettingsPageConfig();
  const storage = new SettingsStorage();
  storage.setItem("calendarUrl", "https://example.com/calendar.ics");
  storage.setItem(
    "personalEvents",
    JSON.stringify([
      {
        id: "evt-1",
        title: "جلسه تیم",
        description: "1405/06/15 10:30",
        startTimestamp: 0,
        endTimestamp: 0,
        isAllDay: false,
      },
    ])
  );

  const root = page.build({ settingsStorage: storage }) as TreeNode;
  const sections = (root.children ?? []).filter(
    (child): child is TreeNode => typeof child === "object" && child !== null
  );

  assert.deepEqual(sections.map(sectionTitle), [
    "تقویم ابری",
    "همگام‌سازی",
    "رویداد دستی",
    "رویدادهای شخصی ثبت‌شده (1)",
    "راهنمای اتصال",
  ]);

  assert.equal(sections[0].children?.[0].type, "Text");
  assert.equal(sections[0].children?.[1].type, "TextInput");
  assert.equal(sections[0].children?.[1].props.settingsKey, "calendarUrl");
  assert.equal(sections[0].children?.[1].props.value, "https://example.com/calendar.ics");
  const syncButton = sections[1].children?.at(-1);
  assert.equal(syncButton?.type, "Button");
  assert.equal(syncButton?.props.color, "primary");
  assert.equal(syncButton?.props.label, "همگام‌سازی تقویم");
  assert.ok(String(syncButton?.props.label).length <= 24);
  assert.equal(sections[2].children?.[1].props.settingsKey, "draftEventTitle");
  assert.equal(sections[2].children?.[2].props.settingsKey, "draftEventDate");
  const feedCopy = textChildren(sections[0]);
  assert.ok(feedCopy.length > 0);
  assert.ok(feedCopy.every((copy) => copy.length <= 40));
  const guideCopy = textChildren(sections[4]);
  assert.ok(guideCopy.some((copy) => copy.includes("iCloud")));
  assert.ok(guideCopy.some((copy) => copy.includes("Google")));
  assert.ok(guideCopy.every((copy) => copy.length <= 52));
  assert.equal(sections[4].children?.length, 5);

  const deleteButton = sections[3].children?.[1];
  assert.equal(deleteButton?.type, "Button");
  (deleteButton?.props.onClick as () => void)();
  assert.deepEqual(JSON.parse(storage.getItem("personalEvents") ?? "[]"), []);
});

test("settings controls preserve callbacks and use only native component props", () => {
  const page = createSettingsPageConfig();
  const storage = new SettingsStorage();
  storage.setItem(
    "personalEvents",
    JSON.stringify([
      {
        id: "evt-2",
        title: "یادآوری خرید",
        description: "1405/06/16",
        startTimestamp: 0,
        endTimestamp: 0,
        isAllDay: true,
      },
    ])
  );
  const root = page.build({ settingsStorage: storage }) as TreeNode;
  const nodes = walk(root);

  const unsupported = new Set(["style", "labelStyle", "subStyle", "direction", "textAlign", "borderRadius"]);
  const allowedProps: Record<string, Set<string>> = {
    View: new Set(),
    Section: new Set(["title"]),
    Text: new Set(["paragraph"]),
    TextInput: new Set(["label", "placeholder", "value", "settingsKey", "onChange"]),
    TextImageRow: new Set(["label", "sublabel"]),
    Button: new Set(["label", "color", "onClick"]),
  };
  for (const node of nodes) {
    assert.ok(allowedProps[node.type], `unexpected settings node ${node.type}`);
    for (const key of Object.keys(node.props)) {
      assert.equal(unsupported.has(key), false, `${node.type} uses unsupported prop ${key}`);
      assert.equal(allowedProps[node.type].has(key), true, `${node.type} uses non-native prop ${key}`);
    }
    for (const value of Object.values(node.props)) {
      if (typeof value === "string") {
        assertNoEmoji(value, node.type);
      }
    }
    for (const child of node.children ?? []) {
      if (typeof child === "string") assertNoEmoji(child, node.type);
    }
  }

  const sections = (root.children ?? []).filter(
    (child): child is TreeNode => typeof child === "object" && child !== null
  );
  const feed = sections[0];
  const urlChange = feed.children?.[1].props.onChange as (value: string) => void;
  urlChange("webcal://example.com/feed.ics");
  assert.equal(storage.getItem("calendarUrl"), "https://example.com/feed.ics");

  const sync = sections[1];
  const syncClick = sync.children?.at(-1)?.props.onClick as () => void;
  syncClick();
  assert.equal(storage.getItem("syncTrigger") !== null, true);

  const manual = sections[2];
  const eventList = sections[3];
  assert.equal(eventList.props.title, "رویدادهای شخصی ثبت‌شده (1)");
  assert.equal(eventList.children?.[0].type, "TextImageRow");
  assert.equal(eventList.children?.[1].type, "Button");
  const titleChange = manual.children?.[1].props.onChange as (value: string) => void;
  const dateChange = manual.children?.[2].props.onChange as (value: string) => void;
  titleChange("جلسه");
  dateChange("1405/06/15 10:30");
  assert.equal(storage.getItem("draftEventTitle"), "جلسه");
  assert.equal(storage.getItem("draftEventDate"), "1405/06/15 10:30");

  const addClick = manual.children?.[manual.children.length - 1].props.onClick as () => void;
  addClick();
  assert.equal(JSON.parse(storage.getItem("personalEvents") ?? "[]").length, 2);
});
