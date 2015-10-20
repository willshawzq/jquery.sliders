$.fn.sliders = function(options) {
	var options = $.extend(true, {intervalTime: 3000}, options);

	var slider = {
		$el: $(this),
		init: function() {	
			this.createStyle();
			this.addEventListener();
			//this.setInterval();
		},
		createStyle: function() {
			var cssArr = [];
			$.each([0, "320px", "650px", "1112px", "1432px", "1432px"], 
				function(i, val) {
					cssArr.push([
						".sliders li:nth-child(",i+2,"){left:",val,"}"
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
				var prevSize = $(ev.target).prevAll().size();
				switch(prevSize) {
					case 1: {
						this.spinLeft();
						break;
					}
					case 2: {
						this.spinLeft();
						break;
					}
					case 3: {
						break;
					}
					case 4: {
						this.spinRight();
						break;
					}
					case 5: {
						this.spinRight();
						break;
					}
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
		setInterval: function() {
			this.timer = setInterval(function() {
				this.spin();
			}.bind(this), options.intervalTime);
		},
		clearInterval: function() {
			clearInterval(this.timer);
		}
	}
	slider.init();
}
$(function(){
	$(".sliders").sliders();
	/*$(".presentation").on(
						"transitionend webkitTransitionEnd oTransitionEnd MSTransitionEnd", 
						function(){
							console.log("ddd");
							$(this).css("z-index", 1);
						}
					);*/
});
