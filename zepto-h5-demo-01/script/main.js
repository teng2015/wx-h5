
var mynum=1;
new iSlider({
    wrap:'.wrap',
    item:'.item',
    playClass:'play',
    lastLocate:false,
    onslide:function (index) {
        $('#my-num').text(mynum);
    },
    loadingImgs:[
        'images/icon/music-ico.png',
        'images/page-move-mask.png',
        'images/page-move-mask2.png',
        'images/query-ico.png',
        'images/sec-1.jpg',
        'images/textbg//sec1-txt1.png',
        'images/textbg/sec1-txt2.png',
        'images/sec-2.png',
        'images/sec-2-pic.jpg',
        'images/textbg/sec2-txt1.png',
        'images/textbg/sec2-txt2.png',
        'images/textbg/sec2-txt3.png',
        'images/textbg/sec2-txt4.png',
        'images/sec-3.png',
        'images/sec-3-pic.jpg',
        'images/textbg/sec3-txt1.png',
        'images/textbg/sec3-txt2.png',
        'images/textbg/sec3-txt3.png',
        'images/textbg/sec3-txt4.png',
        'images/sec-4-pic.jpg',
        'images/textbg/sec4-txt1.png',
        'images/textbg/sec4-txt2.png',
        'images/textbg/sec4-txt3.png',
        'images/icon/share-tips.png'
    ],

    onloading:function (loaded,total) {
        this.$('#mask').style.display="block";
        this.$('#loading div').style.width=loaded/total*100+'%';
        if (loaded==total) {
            this.$('#mask').style.display="none";
        }
    }
});


