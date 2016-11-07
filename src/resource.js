var res = {
   bat_frames: "res/bat_frames.png",
   leftbutton_png: "res/leftbutton.png",
   rightbutton_png: "res/rightbutton.png",
// 新たに追加したもの
   sir: "res/sir_awesome_frames.png",
   sir_pl: "res/sir.plist",
   slime_g: "res/slime_green_frames.png",
   slime_r: "res/slime_red_frames.png",
   zombie: "res/zombie_frames.png",
   block: "res/block48X48.png",
   coin: "res/coins.png",
   curtain: "res/curtain.png",
   dead_sword: "res/dead_sword.png",
   glass_frames: "res/glass_frames.png",
   item_health: "res/item_health.png",
   title: "res/title.png",
   btn_play: "res/btn_play.png",
   sparkle_frames: "res/sparkle_frames.png",
   ui_panels: "res/ui_panels.png",
   ui_gauge_fill: "res/ui_gauge_fill.png",
   background_b: "res/background_back.png",
   background_f: "res/background_front.png",
   background_l_s: "res/background_light_shafts.png",
   //: "res/.png",


};

var g_resources = [];
for (var i in res) {
   g_resources.push(res[i]);
}
