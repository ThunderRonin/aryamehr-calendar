// ARYAMEHR ADDITION START
import { createAryaMehrWidget } from './aryamehr-widget.js';
// ARYAMEHR ADDITION END
    /*
    ** Watch_Face_Editor tool v 18.0
    ** watchface js version v2.1.1
    ** Copyright © SashaCX75. All Rights Reserved
    */
   
    try {
    (() => {
        //start of ignored block
        const __$$app$$__ = __$$hmAppManager$$__.currentApp;
        function getApp() {
            return __$$app$$__.app;
        }
        function getCurrentPage() {
            return __$$app$$__.current && __$$app$$__.current.module;
        }
        const __$$module$$__ = __$$app$$__.current;
        const h = new DeviceRuntimeCore.WidgetFactory(new DeviceRuntimeCore.HmDomApi(__$$app$$__, __$$module$$__));
        const {px} = __$$app$$__.__globals__;
        //const logger = Logger.getLogger('watchface_SashaCX75');
        const logger = DeviceRuntimeCore.HmLogger.getLogger('watchface_SashaCX75')
        //end of ignored block

        //dynamic modify start

        
        let normal_background_bg_img = ''
        let normal_alarm_clock_icon_img = ''
        let normal_alarm_clock_current_text_font = ''
        let normal_moon_image_progress_img_level = ''
        let normal_system_disconnect_img = ''
        let normal_system_clock_img = ''
        let normal_heart_rate_icon_img = ''
        let normal_heart_rate_text_font = ''
        let normal_battery_current_text_font = ''
        let normal_distance_icon_img = ''
        let normal_distance_current_text_font = ''
        let normal_step_icon_img = ''
        let normal_step_current_text_font = ''
        let normal_month_text_font = ''
        let normal_dow_text_font = ''
        let normal_DOW_Array = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        let normal_day_text_font = ''
        let normal_weather_image_progress_img_level = ''
        let normal_temperature_icon_img = ''
        let normal_temperature_max_min_text_font = ''
        let normal_city_name_text = ''
        let normal_time_hour_text_font = ''
        let normal_timerTimeUpdate = undefined;
        let normal_time_minute_text_font = ''
        let normal_time_second_text_font = ''
        let idle_background_bg_img = ''
        let idle_alarm_clock_icon_img = ''
        let idle_alarm_clock_current_text_font = ''
        let idle_system_disconnect_img = ''
        let idle_system_clock_img = ''
        let idle_heart_rate_icon_img = ''
        let idle_heart_rate_text_font = ''
        let idle_battery_current_text_font = ''
        let idle_distance_icon_img = ''
        let idle_distance_current_text_font = ''
        let idle_step_icon_img = ''
        let idle_step_current_text_font = ''
        let idle_month_text_font = ''
        let idle_dow_text_font = ''
        let idle_DOW_Array = ['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'];
        let idle_day_text_font = ''
        let idle_temperature_icon_img = ''
        let idle_temperature_max_min_text_font = ''
        let idle_city_name_text = ''
        let idle_time_hour_text_font = ''
        let idle_timerTimeUpdate = undefined;
        let idle_time_minute_text_font = ''
        let normal_cal_jumpable_img_click = ''
        let normal_battery_jumpable_img_click = ''
        let normal_sunrise_jumpable_img_click = ''
        let normal_moon_jumpable_img_click = ''
        let Button_1 = ''
        let Button_2 = ''
        let Button_3 = ''
        let Button_4 = ''
        let Button_5 = ''
        let Button_6 = ''
        let Button_7 = ''
        let timeSensor = '';


        //dynamic modify end

        __$$module$$__.module = DeviceRuntimeCore.WatchFace({
            init_view() {
                //dynamic modify start
                    
                
            // FontName: REGISTER.TTF; FontSize: 40
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: 464,
              y: 464,
              w: 736,
              h: 42,
              text_size: 40,
              char_space: 0,
              line_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              align_h: hmUI.align.RIGHT,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              text: "0123456789 _+-.,:;`'%°\\/",
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            // FontName: REGISTER.TTF; FontSize: 21
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: 464,
              y: 464,
              w: 440,
              h: 21,
              text_size: 21,
              char_space: 2,
              line_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFC0C0C0,
              align_h: hmUI.align.RIGHT,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              text: "0123456789 _+-.,:;`'%°\\/",
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            // FontName: REGISTER.TTF; FontSize: 40; Cache: full
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: 464,
              y: 464,
              w: 48,
              h: 48,
              text_size: 40,
              char_space: 0,
              line_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              align_h: hmUI.align.RIGHT,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.NONE,
              text: "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя  ҐЄІЇґєії _+-.,:;`'%°\\/",
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            // FontName: REGISTER.TTF; FontSize: 20; Cache: full
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: 464,
              y: 464,
              w: 24,
              h: 24,
              text_size: 20,
              char_space: 0,
              line_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              align_h: hmUI.align.CENTER_H,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.NONE,
              text: "0123456789 ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz АБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЪЫЬЭЮЯабвгдеёжзийклмнопрстуфхцчшщъыьэюя  ҐЄІЇґєії _+-.,:;`'%°\\/",
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            // FontName: REGISTER.TTF; FontSize: 70
            hmUI.createWidget(hmUI.widget.TEXT, {
              x: 464,
              y: 464,
              w: 1284,
              h: 73,
              text_size: 70,
              char_space: 0,
              line_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFFFFFFF,
              align_h: hmUI.align.RIGHT,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              text: "0123456789 _+-.,:;`'%°\\/",
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            console.log('Watch_Face.ScreenNormal');
            normal_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: 466,
              h: 466,
              src: 'A100_002.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_alarm_clock_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 344,
              y: 92,
              src: 'A100_004.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_alarm_clock_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 182,
              y: 83,
              w: 150,
              h: 90,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              padding: true,
              type: hmUI.data_type.ALARM_CLOCK,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_moon_image_progress_img_level = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 113,
              y: 80,
              image_array: ["Moon_01.png","Moon_02.png","Moon_03.png","Moon_04.png","Moon_05.png","Moon_06.png","Moon_07.png","Moon_08.png","Moon_09.png","Moon_10.png","Moon_11.png","Moon_12.png","Moon_13.png","Moon_14.png","Moon_15.png","Moon_16.png","Moon_17.png","Moon_18.png","Moon_19.png","Moon_20.png","Moon_21.png","Moon_22.png","Moon_23.png","Moon_24.png","Moon_25.png","Moon_26.png","Moon_27.png","Moon_28.png","Moon_29.png","Moon_30.png"],
              image_length: 30,
              // alpha: 99,
              type: hmUI.data_type.MOON,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_moon_image_progress_img_level.setAlpha(99);

            normal_system_disconnect_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 40,
              y: 215,
              src: 'bluetooth_5_n.png',
              type: hmUI.system_status.DISCONNECT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_system_clock_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 344,
              y: 92,
              src: 'A100_076.png',
              type: hmUI.system_status.CLOCK,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_heart_rate_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 366,
              src: 'A100_062.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_heart_rate_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 184,
              y: 354,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.HEART,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_battery_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 99,
              y: 50,
              w: 144,
              h: 44,
              text_size: 21,
              char_space: 2,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFC0C0C0,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              unit_type: 1,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_distance_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 325,
              src: 'A100_060.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_distance_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 186,
              y: 314,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.DISTANCE,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_step_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 288,
              src: 'A100_007.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_step_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 186,
              y: 274,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.STEP,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            if (!timeSensor) timeSensor = hmSensor.createSensor(hmSensor.id.TIME);
            timeSensor.addEventListener(timeSensor.event.DAYCHANGE, function() {
              time_update(true);
            });

            normal_month_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 234,
              y: 163,
              w: 99,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_dow_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 90,
              y: 163,
              w: 99,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // unit_string: MON, TUE, WED, THU, FRI, SAT, SUN,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_day_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 112,
              y: 163,
              w: 146,
              h: 78,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_weather_image_progress_img_level = hmUI.createWidget(hmUI.widget.IMG_LEVEL, {
              x: 73,
              y: 280,
              image_array: ["meteo_1.png","meteo_2.png","meteo_3.png","meteo_4.png","meteo_5.png","meteo_6.png","meteo_7.png","meteo_8.png","meteo_9.png","meteo_10.png","meteo_11.png","meteo_12.png","meteo_13.png","meteo_14.png","meteo_15.png","meteo_16.png","meteo_17.png","meteo_18.png","meteo_19.png","meteo_20.png","meteo_21.png","meteo_22.png","meteo_23.png","meteo_24.png","meteo_25.png","meteo_26.png","meteo_27.png","meteo_28.png","meteo_29.png"],
              image_length: 29,
              // alpha: 88,
              type: hmUI.data_type.WEATHER_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_weather_image_progress_img_level.setAlpha(88);

            normal_temperature_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 130,
              src: 'A100_006.png',
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_temperature_max_min_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 133,
              y: 123,
              w: 199,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              padding: true,
              type: hmUI.data_type.WEATHER_HIGH_LOW,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });
              const weatherSensor = hmSensor.createSensor(hmSensor.id.WEATHER);

            normal_city_name_text = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 158,
              y: 406,
              w: 150,
              h: 45,
              text_size: 20,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.CENTER_H,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            let screenType = hmSetting.getScreenType();
            normal_time_hour_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 102,
              y: 205,
              w: 99,
              h: 99,
              text_size: 70,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFFFFFFF,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_time_minute_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 237,
              y: 205,
              w: 99,
              h: 99,
              text_size: 70,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFFFFFFF,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.LEFT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_time_second_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 353,
              y: 205,
              w: 99,
              h: 99,
              text_size: 70,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.LEFT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });


            console.log('Watch_Face.ScreenAOD');
            idle_background_bg_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 0,
              y: 0,
              w: 466,
              h: 466,
              src: 'A100_002.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_alarm_clock_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 344,
              y: 92,
              src: 'A100_004.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_alarm_clock_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 182,
              y: 83,
              w: 150,
              h: 90,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              padding: true,
              type: hmUI.data_type.ALARM_CLOCK,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_system_disconnect_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 40,
              y: 215,
              src: 'bluetooth_5_n.png',
              type: hmUI.system_status.DISCONNECT,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_system_clock_img = hmUI.createWidget(hmUI.widget.IMG_STATUS, {
              x: 344,
              y: 92,
              src: 'A100_076.png',
              type: hmUI.system_status.CLOCK,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_heart_rate_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 366,
              src: 'A100_062.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_heart_rate_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 184,
              y: 354,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.HEART,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_battery_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 144,
              y: 50,
              w: 99,
              h: 44,
              text_size: 21,
              char_space: 2,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFC0C0C0,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              unit_type: 1,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_distance_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 325,
              src: 'A100_060.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_distance_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 186,
              y: 314,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.DISTANCE,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_step_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 288,
              src: 'A100_007.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_step_current_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 186,
              y: 274,
              w: 146,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF979797,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              type: hmUI.data_type.STEP,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_month_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 234,
              y: 163,
              w: 99,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_dow_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 90,
              y: 163,
              w: 99,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // unit_string: MON, TUE, WED, THU, FRI, SAT, SUN,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_day_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 112,
              y: 163,
              w: 146,
              h: 78,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF969696,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_temperature_icon_img = hmUI.createWidget(hmUI.widget.IMG, {
              x: 343,
              y: 126,
              src: 'A100_005.png',
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_temperature_max_min_text_font = hmUI.createWidget(hmUI.widget.TEXT_FONT, {
              x: 133,
              y: 123,
              w: 199,
              h: 99,
              text_size: 40,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              padding: true,
              type: hmUI.data_type.WEATHER_HIGH_LOW,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_city_name_text = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 158,
              y: 406,
              w: 150,
              h: 45,
              text_size: 20,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFF808080,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.CENTER_H,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_time_hour_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 102,
              y: 205,
              w: 99,
              h: 99,
              text_size: 70,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFFFFFFF,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.RIGHT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_AOD,
            });

            idle_time_minute_text_font = hmUI.createWidget(hmUI.widget.TEXT, {
              x: 237,
              y: 205,
              w: 99,
              h: 99,
              text_size: 70,
              char_space: 0,
              font: 'fonts/REGISTER.TTF',
              color: 0xFFFFFFFF,
              line_space: 0,
              align_v: hmUI.align.TOP,
              text_style: hmUI.text_style.ELLIPSIS,
              align_h: hmUI.align.LEFT,
              // padding: true,
              show_level: hmUI.show_level.ONLY_AOD,
            });
            console.log('Watch_Face.Shortcuts');

            normal_cal_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 294,
              y: 310,
              w: 100,
              h: 40,
              type: hmUI.data_type.CAL,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_battery_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 192,
              y: 33,
              w: 89,
              h: 33,
              type: hmUI.data_type.BATTERY,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_sunrise_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 104,
              y: 198,
              w: 66,
              h: 67,
              type: hmUI.data_type.SUN_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            normal_moon_jumpable_img_click = hmUI.createWidget(hmUI.widget.IMG_CLICK, {
              x: 92,
              y: 76,
              w: 58,
              h: 49,
              type: hmUI.data_type.MOON_CURRENT,
              show_level: hmUI.show_level.ONLY_NORMAL,
            });

            console.log('Watch_Face.Buttons');
            Button_1 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 381,
              y: 201,
              w: 58,
              h: 68,
              text: '',
              color: 0xFF00FF00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'PhoneHomeScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_2 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 222,
              y: 77,
              w: 99,
              h: 40,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'AlarmInfoScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_3 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 199,
              y: 269,
              w: 144,
              h: 40,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'activityAppScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_4 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 199,
              y: 351,
              w: 144,
              h: 40,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'heart_app_Screen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_5 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 225,
              y: 158,
              w: 144,
              h: 41,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'ScheduleCalScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_6 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 230,
              y: 210,
              w: 111,
              h: 44,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'BaroAltimeterScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

            Button_7 = hmUI.createWidget(hmUI.widget.BUTTON, {
              x: 83,
              y: 310,
              w: 99,
              h: 66,
              text: '',
              color: 0xFFFF8C00,
              text_size: 24,
              press_src: '0_empty.png',
              normal_src: '0_empty.png',
              click_func: (button_widget) => {
                hmApp.startApp({url: 'WeatherScreen', native: true });
              }, // end func
              show_level: hmUI.show_level.ONLY_NORMAL,
            }); // end button

// ARYAMEHR ADDITION START
            const refreshAryaMehr = createAryaMehrWidget(timeSensor);
// ARYAMEHR ADDITION END
            //#region time_update
            function time_update(updateHour = false, updateMinute = false) {
// ARYAMEHR ADDITION START
              refreshAryaMehr();
// ARYAMEHR ADDITION END
              console.log('time_update()');
              let hour = timeSensor.hour;
              let minute = timeSensor.minute;
              let second = timeSensor.second;
              let format_hour = timeSensor.format_hour;

              console.log('month font');
              if (updateHour) {
                let normal_monthStr = timeSensor.month.toString();
                normal_monthStr = normal_monthStr.padStart(2, '0');
                normal_month_text_font.setProperty(hmUI.prop.TEXT, normal_monthStr );
              };

              console.log('day of week font');
              if (updateHour) {
                let normal_DOW_Str = normal_DOW_Array[timeSensor.week-1];
                normal_dow_text_font.setProperty(hmUI.prop.TEXT, normal_DOW_Str );
                if (timeSensor.week >= 6) normal_dow_text_font.setProperty(hmUI.prop.COLOR, 0xFF00DE00);
                else normal_dow_text_font.setProperty(hmUI.prop.COLOR, 0xFF969696);
              };

              console.log('day font');
              if (updateHour) {
                let normal_dayStr = timeSensor.day.toString();
                normal_dayStr = normal_dayStr.padStart(2, '0');
                normal_day_text_font.setProperty(hmUI.prop.TEXT, normal_dayStr );
              };

              console.log('hour font');
              if (updateHour) {
                let normal_hourStr = format_hour.toString();
                normal_hourStr = normal_hourStr.padStart(2, '0');
                normal_time_hour_text_font.setProperty(hmUI.prop.TEXT, normal_hourStr );
              };

              console.log('minute font');
              if (updateMinute) {
                let normal_minuteStr = minute.toString();
                normal_minuteStr = normal_minuteStr.padStart(2, '0');
                normal_time_minute_text_font.setProperty(hmUI.prop.TEXT, normal_minuteStr );
              };

              console.log('second font');
                let normal_secondStr = second.toString();
                normal_secondStr = normal_secondStr.padStart(2, '0');
                normal_time_second_text_font.setProperty(hmUI.prop.TEXT, normal_secondStr );
              console.log('month font');
              if (updateHour) {
                let idle_monthStr = timeSensor.month.toString();
                idle_monthStr = idle_monthStr.padStart(2, '0');
                idle_month_text_font.setProperty(hmUI.prop.TEXT, idle_monthStr );
              };

              console.log('day of week font');
              if (updateHour) {
                let idle_DOW_Str = idle_DOW_Array[timeSensor.week-1];
                idle_dow_text_font.setProperty(hmUI.prop.TEXT, idle_DOW_Str );
                if (timeSensor.week >= 6) idle_dow_text_font.setProperty(hmUI.prop.COLOR, 0xFF00DE00);
                else idle_dow_text_font.setProperty(hmUI.prop.COLOR, 0xFF969696);
              };

              console.log('day font');
              if (updateHour) {
                let idle_dayStr = timeSensor.day.toString();
                idle_dayStr = idle_dayStr.padStart(2, '0');
                idle_day_text_font.setProperty(hmUI.prop.TEXT, idle_dayStr );
              };

              console.log('hour font');
              if (updateHour) {
                let idle_hourStr = format_hour.toString();
                idle_hourStr = idle_hourStr.padStart(2, '0');
                idle_time_hour_text_font.setProperty(hmUI.prop.TEXT, idle_hourStr );
              };

              console.log('minute font');
              if (updateMinute) {
                let idle_minuteStr = minute.toString();
                idle_minuteStr = idle_minuteStr.padStart(2, '0');
                idle_time_minute_text_font.setProperty(hmUI.prop.TEXT, idle_minuteStr );
              };

            };

            //#endregion
            function scale_call() {
              console.log('scale_call()');

              console.log('Weather city name');
              let weatherData = weatherSensor.getForecastWeather();
              let normal_cityNameStr = weatherData.cityName;
              normal_city_name_text.setProperty(hmUI.prop.TEXT, normal_cityNameStr);

              console.log('Weather city name');
              let idle_cityNameStr = weatherData.cityName;
              idle_city_name_text.setProperty(hmUI.prop.TEXT, idle_cityNameStr);

            };

            const widgetDelegate = hmUI.createWidget(hmUI.widget.WIDGET_DELEGATE, {
              resume_call: (function () {
                console.log('resume_call()');
                scale_call();
                time_update(true, true);
                if (screenType == hmSetting.screen_type.WATCHFACE) {
                  if (!normal_timerTimeUpdate) {
                    normal_timerTimeUpdate = timer.createTimer(0, 1000, (function (option) {
                      let updateHour = timeSensor.minute == 0 && timeSensor.second < 2;
                      let updateMinute = timeSensor.second < 2;
                      time_update(updateHour, updateMinute);
                    }));  // end timer 
                  };  // end timer check
                };  // end screenType

                if (screenType == hmSetting.screen_type.AOD) {
                  if (!idle_timerTimeUpdate) {
                    idle_timerTimeUpdate = timer.createTimer(0, 1000, (function (option) {
                      let updateHour = timeSensor.minute == 0 && timeSensor.second < 2;
                      let updateMinute = timeSensor.second < 2;
                      time_update(updateHour, updateMinute);
                    }));  // end timer 
                  };  // end timer check
                };  // end screenType


              }),
              pause_call: (function () {
                console.log('pause_call()');
                if (normal_timerTimeUpdate) {
                  timer.stopTimer(normal_timerTimeUpdate);
                  normal_timerTimeUpdate = undefined;
                }
                if (idle_timerTimeUpdate) {
                  timer.stopTimer(idle_timerTimeUpdate);
                  idle_timerTimeUpdate = undefined;
                }

              }),
            });

                //dynamic modify end
            },
            onInit() {
                logger.log('index page.js on init invoke');
            },
            build() {
                this.init_view();
                logger.log('index page.js on ready invoke');
            },
            onDestroy() {
                logger.log('index page.js on destroy invoke');
            }
        });
        ;
    })();
} catch (e) {
    console.log('Mini Program Error', e);
    e && e.stack && e.stack.split(/\n/).forEach(i => console.log('error stack', i));
    ;
}