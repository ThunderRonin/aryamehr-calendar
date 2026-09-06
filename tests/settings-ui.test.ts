import { test } from "node:test";
import assert from "node:assert/strict";
import { createSettingsPageConfig } from "../src/setting/settings-config";

type TreeNode = {
  type: string;
  props: Record<string, unknown>;
  children?: TreeNode[];
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

const factory = (type: string) => (props: Record<string, unknown> = {}, children: TreeNode[] = []) => ({
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

test("settings tree presents the feed, sync, manual event, and guide sections in order", () => {
  const page = createSettingsPageConfig();
  const storage = new SettingsStorage();
  storage.setItem("calendarUrl", "https://example.com/calendar.ics");

  const root = page.build({ settingsStorage: storage }) as TreeNode;
  const sections = root.children ?? [];

  assert.deepEqual(sections.map(sectionTitle), [
    "تقویم ابری",
    "همگام‌سازی",
    "رویداد دستی",
    "راهنمای اتصال",
  ]);

  assert.equal(sections[0].children?.[0].type, "Text");
  assert.equal(sections[0].children?.[1].type, "TextInput");
  assert.equal(sections[0].children?.[1].props.settingsKey, "calendarUrl");
  assert.equal(sections[0].children?.[1].props.value, "https://example.com/calendar.ics");
  assert.equal(sections[1].children?.at(-1)?.type, "Button");
  assert.equal(sections[2].children?.[0].props.settingsKey, "draftEventTitle");
  assert.equal(sections[2].children?.[1].props.settingsKey, "draftEventDate");
  assert.equal(sections[3].children?.length, 5);
});

test("settings controls preserve callbacks and use only native component props", () => {
  const page = createSettingsPageConfig();
  const storage = new SettingsStorage();
  const root = page.build({ settingsStorage: storage }) as TreeNode;
  const nodes = walk(root);

  const unsupported = new Set(["style", "labelStyle", "subStyle", "direction", "textAlign", "borderRadius"]);
  for (const node of nodes) {
    for (const key of Object.keys(node.props)) {
      assert.equal(unsupported.has(key), false, `${node.type} uses unsupported prop ${key}`);
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

  const feed = (root.children ?? [])[0];
  const urlChange = feed.children?.[1].props.onChange as (value: string) => void;
  urlChange("webcal://example.com/feed.ics");
  assert.equal(storage.getItem("calendarUrl"), "https://example.com/feed.ics");

  const sync = (root.children ?? [])[1];
  const syncClick = sync.children?.at(-1)?.props.onClick as () => void;
  syncClick();
  assert.equal(storage.getItem("syncTrigger") !== null, true);

  const manual = (root.children ?? [])[2];
  const titleChange = manual.children?.[1].props.onChange as (value: string) => void;
  const dateChange = manual.children?.[2].props.onChange as (value: string) => void;
  titleChange("جلسه");
  dateChange("1405/06/15 10:30");
  assert.equal(storage.getItem("draftEventTitle"), "جلسه");
  assert.equal(storage.getItem("draftEventDate"), "1405/06/15 10:30");

  const addClick = manual.children?.[manual.children.length - 1].props.onClick as () => void;
  addClick();
  assert.equal(JSON.parse(storage.getItem("personalEvents") ?? "[]").length, 1);
});
