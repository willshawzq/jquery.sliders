
window.ZQ = {
	version: "1.0.0",
	copyRight: "copyright © WillShaw"
}
;(function(window) {
	"use strict";
	var Tools = ZQ.Tools || {};
	Tools.elScale = function(el, callback, senArea) {
		var side = "", senArea = senArea || 15,
			elWidth = "", elHeight = "",
			disX = "", disY = "",
			disL = "", disT = "";

		var getSide = function(el, ev) {
			elWidth = el.offsetWidth;
			elHeight = el.offsetHeight;
			disX = ev.clientX;
			disY = ev.clientY;
			disL = el.offsetLeft;
			disT = el.offsetTop;

			var iR = disL + elWidth - senArea,
				iL = disL + senArea,
				iT = disT + senArea,
				iB = disT + elHeight - senArea,
				sides = [];

			if(iR < disX)  {
				sides.push("R");
			}else if(disX < iL) {
				sides.push("L");
			}
			if(disY < iT) {
				sides.push("T");
			}else if(disY > iB) {
				sides.push("B");
			}
			if(sides.length == 0 && 
				(iL < disX < iR) && (iT < disY < iB) ) {
				sides.push("C");
			}
			return sides.join("");
		}
		var funcList = function(el, ev) {
			var baseFunc = {
				"R": function(el, ev) {
					el.style.width = elWidth + (ev.clientX - disX) + "px";
				},
				"L": function(el, ev) {
					el.style.width = elWidth + (disX - ev.clientX) + "px";
					el.style.left = (ev.clientX - disX) + "px";
				},
				"T": function(el, ev) {
					el.style.height = elHeight + (disY -ev.clientY) + "px";
					el.style.top = disT + (ev.clientY - disY) + "px";
				},
				"B": function(el, ev) {
					el.style.height = elHeight + (ev.clientY - disY) + "px";
				}
			};

			var funcList = {};
			
			"R L T B RT RB LT LB".split(" ").forEach(function(val, i) {
				funcList[val] = (function(val) {
					return function(el, ev){
						val.split("").forEach(function(v, k) {
							return baseFunc[v](el, ev);
						});	
					}
				})(val);		
			});
			return funcList;
		}
		var setHover = function(side) {
			var	sides = "R L T B RB LT RT LB C".split(" "),
				pointers = "w-resize n-resize nw-resize ne-resize default".split(" ");

			var index = Math.floor(sides.indexOf(side) / 2);
			if(pointers[index]) {
				return pointers[index];
			}
		}
		var mouseMove = function(ev) {
			var ev = ev || window.event;
			var func = funcList();
			if(side && side.indexOf("C") == -1) {
				func[side](el, ev);
			}
		}
		var mouseUp = function() {
			el.style.cursor = "default";
			document.removeEventListener("mousemove", mouseMove);
			document.removeEventListener("mouseup", mouseUp);
		}
		el.addEventListener("mousedown", function(ev) {
			ev = ev || window.event;

			side = getSide(this, ev);
			document.addEventListener("mousemove", mouseMove);
			document.addEventListener("mouseup", mouseUp);

			return false;
		});
		el.addEventListener("mouseover", function(ev) {
			el.style.cursor = setHover(getSide(el, ev));
		});
	}
	ZQ.Tools = Tools;
}(window));

