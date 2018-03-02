<template>
	<div class="ratingselect">
		<div class="rating-type border-1px">
			<span @click="select(2,$event)" class="block positive" :class="{'active':selectType===2}">{{desc.all}}<span class="count">{{ratings.length}}</span></span>
			<span @click="select(0,$event)" class="block positive" :class="{'active':selectType===0}">{{desc.positive}}<span class="count">{{positives.length}}</span></span>
			<span @click="select(1,$event)" class="block negative" :class="{'active':selectType===1}">{{desc.negative}}<span class="count">{{negatives.length}}</span></span>
		</div>
		<div @click="toggleContent" class="switch" :class="{'on':onlyContent}">
			<span class="icon-check_circle"></span>
			<span class="text">只看有内容的评价</span>
		</div>
	</div>
</template>

<script>
	const POSITIVE = 0;
	const NEGATIVE = 1;
	const ALL = 2;
	
	export default {
		props : {
			ratings: {//所有的评价
				type : Array,
				default() {
					return [];
				}
			},
			selectType: {//选择的评价类型（全部、好评、差评）
				type : Number,
				default: ALL
			},
			onlyContent: {//是否只看有内容的评价
				type: Boolean,
				default: false
			},
			desc: {//评价的类型名字
				type: Object,
				default(){
					return {
						all: "全部",
						positive: '满意',
						negative: '不满意'
					};
				}
			}
		},
		computed: {
	      positives() {//过滤好评
	        return this.ratings.filter((rating) => {
	          return rating.rateType === POSITIVE;
	        });
	      },
	      negatives() {//过滤差评
	        return this.ratings.filter((rating) => {
	          return rating.rateType === NEGATIVE;
	        });
	      }
	    },
		methods: {
			select(type, event) {//选择看那种类型的评价（全部、好评、差评）
		        if (!event._constructed) {
		          return;
		        }
//		        this.selectType = type;
		        this.$emit('select', type);//通知父级
		    },
		    toggleContent(event) {//选择是否 只看 有内容的  评价
		        if (!event._constructed) {
		          return;
		        }
//		        this.onlyContent = !this.onlyContent;
		        this.$emit('toggle');//通知父级
		    }
		}
	}
</script>

<style lang="stylus" rel="stylesheet/stylus">
  @import "../../common/stylus/mixin.styl"

  .ratingselect
    .rating-type
      padding: 18px 0
      margin: 0 18px
      border-1px(rgba(7, 17, 27, 0.1))
      font-size: 0
      .block
        display: inline-block
        padding: 8px 12px
        margin-right: 8px
        line-height: 16px
        border-radius: 1px
        font-size: 12px
        color: rgb(77, 85, 93)
        &.active
          color: #fff
        .count
          margin-left: 2px
          font-size: 8px
        &.positive
          background: rgba(0, 160, 220, 0.2)
          &.active
            background: rgb(0, 160, 220)
        &.negative
          background: rgba(77, 85, 93, 0.2)
          &.active
            background: rgb(77, 85, 93)
    .switch
      padding: 12px 18px
      line-height: 24px
      border-bottom: 1px solid rgba(7, 17, 27, 0.1)
      color: rgb(147, 153, 159)
      font-size: 0
      &.on
        .icon-check_circle
          color: #00c850
      .icon-check_circle
        display: inline-block
        vertical-align: top
        margin-right: 4px
        font-size: 24px
      .text
        display: inline-block
        vertical-align: top
        font-size: 12px
</style>