/*!
 * GISC Image Slider v1.0.0
 * Author: Ghanashyam Chaudhari
 * 
 */
var GImageSlider;

!function() {
	var n;
  GImageSlider = function(){
    this._g_sl = 1;
    this._defaults = {
      imageCount: false,
      imageTitle: false,
      animation: 'fade',
      enableLog: false
    };
    this._maindivid = "gisimgcmnmdl";
    this._img_slds_html = null;
    this._isl_div = jQuery("<div id='" + this._maindivid + "' class='giscmnmdl' data-gisccont='gisimgcmnmdl'></div>");
	}, n = GImageSlider, n.prototype = {
    init: function(options) {
      jQuery.extend(this._defaults, options);
    },

    gEnlrgImgCrsl: function($this) {
      if((this.tagName($this).toLowerCase() !== 'ul') || ($this.find('li').length <= 0)) {
        this.log("Current element must be UL and it contains atleast one li tag with image path.");
        this.log("e.g. <li>http://www.example.com/image.jpg</li>");
      } else {
        var $prev = $this.prev();
        if((jQuery.inArray(this.tagName($prev).toLowerCase(), ['img','input','button']) >= 0) || ($prev.find('img, input, button').length)) {
          if($prev.find('img, input, button').length) {
            $prev = $prev.find('img, input, button');
          }
          $prev.on("click", this.gCheckInitiateHTML);
          $prev.attr("data-anim", this._defaults.animation);
        } else {
          this.log("Previous element must be input(type = button), button or image. Current Previous HTML element is : " + this.tagName($prev).toLowerCase());
        }
      }
    },

    gCheckInitiateHTML: function() {
      var $this = jQuery(this);
      if($this.attr("data-anim")) jQuery.gisc._defaults.animation = $this.attr("data-anim");
      $ul = '';
      if($this.next('ul').length) {
        $ul = $this.next('ul');
      } else if($this.parent().next('ul').length) {
        $ul = $this.parent().next('ul');
      }
      if($ul && ($ul.find('li').length > 0)) {
        var $imgs = [];
        $ul.find('li').each(function(){
          var $li = jQuery(this);
          var src = $li.text();
          var title = ($li.is("[title]")) ? $li.attr('title') : '';
          if(src) $imgs.push({'title':title,'src':src});
        });
        if($imgs.length) {
          jQuery.gisc.gCreateImgSldsHTML($imgs);
        } else {
          jQuery.gisc.log("No image path found.");
        }
      } else {
        jQuery.gisc.log("Next element or next of Parent element must be UL and it contains atleast one li.");
        jQuery.gisc.log("e.g. <img /><ul></ul>");
        jQuery.gisc.log("OR");
        jQuery.gisc.log("e.g. <div><img /><div><ul></ul>");
      }
    },

    gCreateImgSldsHTML: function($imgs) {
      if($imgs.length) {
        var $imgsldshtml = (this._isl_div).clone();
        var $destroyBtn = jQuery("<span/>").addClass('giscclsmdl').html('&times;');
        $destroyBtn.on("click", this.destroyGImgSlds);
        $imgsldshtml.append($destroyBtn);
        var $giscsldshwcntnr = jQuery("<div/>").addClass('giscsldshwcntnr').attr({ 'data-gisccont':'giscsldshwcntnr' });
        for(var i=0; i<$imgs.length; i++) {
          var $giscimgslds = jQuery("<div/>").addClass('giscimgslds g-isc-anm-'+this._defaults.animation).attr({ 'data-gisccont':'giscimgslds' });
          if(this._defaults.imageCount) {
            $giscimgslds.append(jQuery('<div/>').addClass('giscnmbrtxt').append(jQuery('<span/>').html((i + 1) + '/' + ($imgs.length))));
          }
          $giscimgslds.append(jQuery('<img/>').attr({ src:$imgs[i].src }).css({'width':'100%'}));
          if(this._defaults.imageCount && ('title' in $imgs[i]) && $imgs[i].title) {
            $giscimgslds.append(jQuery('<div/>').addClass('gisccptxt').append(jQuery('<span/>').html($imgs[i].title)));
          }
          $giscsldshwcntnr.append($giscimgslds);
          $giscsldshwcntnr.append($giscimgslds);
        }
        $giscsldshwcntnr.append(jQuery("<a/>").addClass('giscprv').html("&#10094;").on("click", this.gSlideImgs));
        $giscsldshwcntnr.append(jQuery("<a/>").addClass('giscnxt').html("&#10095;").on("click", this.gSlideImgs));
        $imgsldshtml.append($giscsldshwcntnr);
        this._img_slds_html = jQuery.extend({}, $imgsldshtml);
        jQuery('body').append(this._img_slds_html);
        this.gShwImgSlds(this._g_sl);
      }
    },

    gShwImgSlds: function() {
      if(this._img_slds_html) {
        this._img_slds_html.find("[data-gisccont='giscimgslds']:first").addClass('active');
        this._img_slds_html.show();
        if (jQuery.mobile) {
          jQuery(document).on('swipeleft swiperight', '[data-gisccont="giscsldshwcntnr"]', function(event) {
            if (event.type === "swipeleft") {
              jQuery(this).find(".giscprv").trigger("click");
            } else if (event.type === "swiperight") {
              jQuery(this).find(".giscnxt").trigger("click");
            }
            event.stopPropagation();
            event.preventDefault();
          });
        }
      }
    },

    gSlideImgs: function() {
      var $this = jQuery(this);
      var $flag = ($this.hasClass('giscprv')) ? -1 : 1;
      var $activeSlide = jQuery.gisc.getGImgActiveSlide();
      if(!$activeSlide) {
        jQuery.gisc.gShwImgSlds();
      } else {
        $activeSlide.removeClass('active');
        switch($flag) {
          case 1: {
            jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']").removeClass('prev');
            jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']").addClass('next');
            if($activeSlide.next("[data-gisccont='giscimgslds']").length) {
              $activeSlide.next("[data-gisccont='giscimgslds']").addClass('next');
              $activeSlide.next("[data-gisccont='giscimgslds']").addClass('active');
            } else {
              jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']:first").addClass('next');
              jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']:first").addClass('active');
            }
            break;
          }
          case -1: {
            jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']").addClass('prev');
            jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']").removeClass('next');
            if($activeSlide.prev("[data-gisccont='giscimgslds']").length) {
              $activeSlide.prev("[data-gisccont='giscimgslds']").addClass('prev');
              $activeSlide.prev("[data-gisccont='giscimgslds']").addClass('active');
            } else {
              jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']:last").addClass('prev');
              jQuery.gisc._img_slds_html.find("[data-gisccont='giscimgslds']:last").addClass('active');
            }
            break;
          }
        }
      }
    },

    getGImgActiveSlide: function() {
      if(this._img_slds_html.find(".active[data-gisccont='giscimgslds']").length) {
        return (this._img_slds_html.find(".active[data-gisccont='giscimgslds']:first"));
      } else {
        return false;
      }
    },

    destroyGImgSlds: function() {
      jQuery.gisc._img_slds_html.remove();
    },

    tagName: function(_this) {
      return _this.prop("tagName");
    },

    log: function(msg) {
      if(this._defaults.enableLog) {
        console.log("*** G Image Slider : " + msg);
      }
    }
  }
}(window, jQuery),
function() {
	jQuery.fn.GImageSlider = function(options = {}) {
    jQuery.gisc.init(options);
    this.each( function() {
      var $this = jQuery(this);
      $this.hide();
      jQuery.gisc.gEnlrgImgCrsl($this);
    });
	};
  jQuery.gisc = new GImageSlider();
}();
