$.fn.sliders = function(options) {
	var options = $.extend(true, {intervalTime: 3000}, options);

	var slider = {
		$el: $(this),
		init: function() {	
			this.createStyle();
			this.addEventListener();
			//this.setInterval();
		},
		getScaleSize: function() {
			var ratios = [
					0.5625, 0.65625,//16:9
					0.75, 0.84375//4:3
				],
				widths = [1920, 1280],
				sWidth = screen.width,
				sHeight = screen.height,
				ratio = sHeight / sWidth;
			if(ratio < ratios[1]) {
				var bSliderHeight = (800 / 1920) * sWidth,
					bSliderWidth = (500 / 800) * bSliderHeight,
					sSliderWidth = bSliderWidth * 0.8,
					sSliderHeight = bSliderHeight * 0.8;
			}else {
				var bSliderHeight = (600 / 1280) * sWidth,
					bSliderWidth = (375 / 600) * bSliderHeight,
					sSliderWidth = bSliderWidth * 0.8,
					sSliderHeight = bSliderHeight * 0.8;
			}
			return [bSliderWidth, bSliderHeight, sSliderWidth, sSliderHeight];
		},
		createStyle: function() {
			var cssArr = [],
				size = this.getScaleSize();
			cssArr.push([
				".sliders {",
					"opacity: 1;",
					"width:" + (size[0] + 4*size[2] - 2*(1/8 + 1/4)*size[2]) + "px;",
					"height:" + size[3] + "px;",
				"}", 
				".sliders li{",
					"width:" + size[2] + "px;",
					"height:" + size[3] + "px;",
				"}",
				".sliders .presentation{",
					"top:" + (-(size[1] - size[3]) / 2) + "px;",
					"width:" + size[0] + "px;",
					"height:" + size[1] + "px;",
				"}",
			].join(""));
			var temp = [
				(1-1/8)*size[2], (1-1/4)*size[2],
				size[0]-(1/4)*size[2], (1-1/8)*size[2]
			];
			$.each([
				0,
				temp[0],
				temp[0] + temp[1],
				temp[0] + temp[1] + temp[2],
				temp[0] + temp[1] + temp[2] + temp[3],
				temp[0] + temp[1] + temp[2] + temp[3]
			], function(i, val) {
					cssArr.push([
						".sliders li:nth-child(",i+2,"){left:",val,"px}"
					].join(""));
				}.bind(this)
			);
			$("head").append(
				$('<style type="text/css"></style>').html(cssArr.join(""))
			);
		},
		addEventListener: function() {
			var $this = this.$el;

			$this.on("click", "li", function(ev) {
				var prevSize = $(ev.target).prevAll().size(), callback = null;
				switch(prevSize) {
					case 1: {
						this.spinRight(1);
						setTimeout(function() {
							this.spinRight();	
						}.bind(this), 1000);
						callback = this.spinRight;
						break;
					}
					case 2: {
						this.spinRight(1);
						callback = this.spinRight;
						break;
					}
					case 3: {
						break;
					}
					case 4: {
						this.spinLeft();
						callback = this.spinLeft;
						break;
					}
					case 5: {
						this.spinLeft();
						setTimeout(function() {
							this.spinLeft();	
						}.bind(this), 1000);
						callback = this.spinLeft;
						break;
					}
				}
				if(callback) {
					this.clearInterval();
					this.setInterval(callback.bind(this));
				}				
			}.bind(this));
		},
		spinRight: function() {
			var size = this.$el.find(".maskLayer-right").nextAll().size();
			if(size > 1) {
				this.spinRight = function() {
					var $now = this.$el.find(".presentation").removeClass("presentation"),
						$nPrev = $now.prev().addClass("presentation"),
						$maskLayer = this.$el.find(".maskLayer-right"),
						$mPrev = $maskLayer.prev();
					$maskLayer.html($mPrev.html());
					$mPrev.insertAfter($maskLayer);
					this.$el.find("li:last").insertBefore(this.$el.find("li:nth-child(2)"));
				}
			}else {
				this.spinRight = function() {
					var $now = this.$el.find(".presentation").removeClass("presentation"),
						$nPrev = $now.prev().addClass("presentation"),
						$maskLayer = this.$el.find(".maskLayer-right"),
						$mPrev = $maskLayer.prev();
					$maskLayer.html($mPrev.html());
					$mPrev.insertBefore(this.$el.find("li:nth-child(2)"));
				}
			}
			
			this.spinRight();
		},
		spinLeft: function() {
			var lSize = this.$el.find(".maskLayer-left").nextAll().size(),
				rSize = this.$el.find(".maskLayer-right").prevAll().size();

			if(lSize > rSize) {
				this.spinLeft = function() {
					var $now = this.$el.find(".presentation").removeClass("presentation"),
						$nNext = $now.next().addClass("presentation"),
						$maskLayer = this.$el.find(".maskLayer-left"),
						$maskLayerR = this.$el.find(".maskLayer-right"),
						$mNext = $maskLayer.next(),
						$rPrev = $maskLayerR.prev();
					$maskLayer.html($mNext.html());
					$mNext.insertAfter(this.$el.find("li:last"));
					//$rPrev.css("z-index", 2);
					//$maskLayerR.css("z-index", 1).html($rPrev.html());
					$maskLayerR.next().insertBefore($maskLayerR);
					/*$(".presentation").on(
						"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
						function(){
							console.log("ddd");
							$rPrev.css("z-index", 1).html("ddd");
						}
					);*/
				}
			}else {
				this.spinLeft = function() {
					var $now = this.$el.find(".presentation").removeClass("presentation"),
						$nNext = $now.next().addClass("presentation"),
						$maskLayer = this.$el.find(".maskLayer-left"),
						$maskLayerR = this.$el.find(".maskLayer-right"),
						$mNext = $maskLayer.next();
					$maskLayer.html($mNext.html());
					$mNext.insertAfter($maskLayerR.prev());
				}
			}
			
			this.spinLeft();
		},
		setInterval: function(callback) {
			callback = callback ? callback() : this.spinLeft();
			this.timer = setInterval(function() {
				callback();
			}, options.intervalTime);
		},
		clearInterval: function() {
			clearInterval(this.timer);
		}
	}
	slider.init();
}
$(function(){
	$(".sliders").sliders();
});
