$.fn.sliders = function(options) {
	var options = $.extend(true, {intervalTime: 4000, sliderNum: 5}, options);

	var slider = {
		$el: $(this),
		start: function() {
			if(arguments.length == 1) {
				this._start = arguments[0];
			}else {
				return this._start;
			}
		},
		init: function() {
			this.start(3);//第三个
			this.createStyle();
			this.addEventListener();
			//this.setInterval();
		},
		getScaleSize: function() {
			var ratios = [
					0.5625, 0.65625, //16:9
					0.75, 0.84375 //4:3
				],
				widths = [1920, 1280],
				barHeight = [80, 64],
				sWidth = screen.width,
				sHeight = screen.height,
				ratio = (sHeight / sWidth);
			if(ratio < ratios[1]) {
				var bSliderHeight  = (800 / 1920) * sWidth,
					bSliderWidth = (500 / 800) * bSliderHeight,
					sSliderWidth = bSliderWidth * 0.8,
					sSliderHeight = bSliderHeight * 0.8,
					bBarHeight = (80 / 800) * bSliderHeight,
					sBarHeight = bBarHeight * 0.8,
					flag = true;
			}else {
				var bSliderHeight = (600 / 1280) * sWidth,
					bSliderWidth = (375 / 600) * bSliderHeight,
					sSliderWidth = bSliderWidth * 0.8,
					sSliderHeight = bSliderHeight * 0.8,
					bBarHeight = (60 / 600) * bSliderHeight,
					sBarHeight = bBarHeight * 0.8,
					flag = false;
			}
			return [bSliderWidth, bSliderHeight, sSliderWidth, sSliderHeight, bBarHeight, sBarHeight, flag];
		},
		getLeftArray: function(size) {
			if(size[6]) {
				var temp = [ 
					(1-1/4)*size[2], (1-1/8)*size[2],
					size[0] - (1/8)*size[2], (1 - 1/4)*size[2]
				];
			}else {
				var temp = [ 
					(1-2/5)*size[2], (1-1/3)*size[2],
					size[0] - (1/3)*size[2], (1 - 2/5)*size[2]
				];
			}
			return [
				0, 
				temp[0], 
				temp[0] + temp[1], 
				temp[0] + temp[1] + temp[2] , 
				temp[0] + temp[1] + temp[2] + temp[3]
			];
		},
		createStyle: function() {
			var cssArr = [],
				size = this.getScaleSize();

			cssArr.push([
				".sliders {",
					"opacity: 1;",
					"width:" + (size[6] ? (size[0] + 4*size[2] - 2*(1/8 + 1/4)*size[2]) : (size[0] + 4*size[2] - 2*(1/3 + 2/5)*size[2])) + "px;",
					"height:" + size[3] + "px;",
				"}",
				".sliders li{",
					"width:" + size[2] + "px;",
					"height:" + size[3] + "px;",
				"}",
				".sliders .slider-3 {",
					"top:" + (-(size[1] - size[3] - size[4] - 12 - 8)) + "px;",
					"width:" + size[0] + "px;",
					"height:" + size[1] + "px;",
				"}",
				".sliders .slider-titleBar {",
					"height:" + size[5] + "px;",
					"margin-top:-"+ size[5] +"px;",
				"}",
				".sliders .slider-3 .slider-titleBar {",
					"height:" + size[4] + "px;",
					"margin-top:-"+ (size[4]+8) +"px;",
				"}"
			].join(""));
			var leftArr = this.getLeftArray(size);
			$.each(leftArr,function(i, val) {
					cssArr.push([
						".sliders .slider-",i+1,"{left:",val,"px;}"
					].join(""));
				}.bind(this)
			);
			cssArr.push([
				".sliders .maskLayer-right {left:", leftArr.pop(),"px;}"
			].join(""));
			$("head").append(
				$('<style type="text/css"></style>').html(cssArr.join(""))
			);
		},
		addEventListener: function() {
			var $this = this.$el;

			$this.on("click", "li .slider-titleBar", function(ev) {
				var callback = null,
					$li = $(ev.target).parents("li"),
					clazz = $li.attr("class"),
					start = parseInt($li.data("index"));

				this.$li = $li;

				switch(clazz) {
					case "slider-1": {
						this.start(
							parseInt(this.$el.find(".slider-2").data("index"))
						);
						this.spinRight();
						setTimeout(function(){
							this.start(start);
							this.spinRight();
						}.bind(this), 1000);
						callback = this.spinRight;
						break;
					}
					case "slider-2": {
						this.start(start);
						this.spinRight();
						callback = this.spinRight;
						break;
					}
					case "slider-3": {
						this.clearInterval();
						break;
					}
					case "slider-4": {
						this.start(start);
						this.spinLeft();
						callback = this.spinLeft;
						break;
					}
					case "slider-5": {
						this.start(
							parseInt(this.$el.find(".slider-4").data("index"))
						);
						this.spinLeft();
						setTimeout(function(){
							this.start(start);
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
		getIndex: function(center, step, length) {
			var leftGap = (step - 1) / 2,
				rightGap = step - 1 - leftGap,
				indexArr = [];
			for(var i = leftGap; i > 0; i--) {
				indexArr.push(
					(center - i + 2*length) % length
				);
			}
			indexArr.push(center);
			for(var i = 1; i <= rightGap; i++) {
				indexArr.push(
					(center + i) % length
				);
			}
			return indexArr;
		},
		updateSlider: function(start) {
			var lis = this.$el.find("> li").toArray().slice(1,-1),
					length = lis.length,
					step = options.sliderNum,
					indexs = this.getIndex(start - 1, step, length);
			$.each(indexs, function(i, el) {
				var clazz = "slider-" + (i+1);
				$(lis[el]).attr("class", clazz).siblings().removeClass(clazz);
			});
		},
		spinRight: function() {
			var length = this.$el.find("> li").size() - 2,
				start = this.start();

			start = start < 1 ? length : start;
			this.updateSlider(start);
			this.start(start - 1);
		},
		spinLeft: function() {
			var length = this.$el.find("> li").size() - 2,
				start = this.start();

			start = start > length ? 1 : start;
			this.updateSlider(start);
			this.start(start + 1);
		},
		setInterval: function(callback) {
			callback = callback ? callback : this.spinLeft.bind(this);
			this.timer = setInterval(function() {
				callback();
			}, options.intervalTime);
		},
		clearInterval: function() {
			clearInterval(this.timer);
		}
	}
	slider.init();
	return this;
}
