var files;
var fileIndex = 0;

function handleFileSelect(evt) {
    files = evt.target.files;
    fileIndex = 0;
    showNextFile();
}

function showNextFile() {
    if (files.length == 0) {
        return;
    }
    f = files[fileIndex];
    fileIndex++; 
    $('.imgs').val(fileIndex + '/' + files.length)
    // Only process image files.
    if (!f.type.match('image.*')) {
        return;
    }

    var reader = new FileReader();

    // Closure to capture the file information.
    reader.onload = (function (theFile) {
        return function (e) {
            // Render thumbnail.
            $(".thumb").remove()
            var span = document.createElement('span');
            span.innerHTML = ['<img class="thumb" src="', e.target.result, '" title="', escape(theFile.name), '"/>'].join('');
            document.getElementById('list').insertBefore(span, null);
            makeButtons();
            setImages(e.target.result);
            hideAll();
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
}

function makeButtons() {
    var rows = $('.rows').val();
    var cols = $('.cols').val();
    var output = $('.kufr');
    output.empty()

    for (r = 0; r < rows; r++) {
        var divRow = $('<div class="row" id="r' + r + '"></div>')
        output.append(divRow)
        for (c = 0; c < cols; c++) {
            var identifier = 'r' + r + 'c' + c;
            var divCell = $('<div class="cell" id="' + identifier + '"></div>')
            divCell.click(toggle);
            divCell.width(40);
            divCell.height(40);

            divRow.append(divCell);
        }
    }
    output.append($('<div style="clear:both"></div>'));
}

function toggle(div) {
    var size = $(this).css('background-size')
    if (size != "0px") {
        $(this).css('background-size', '0px');
    } else {
        $(this).css('background-size', windowWidth + "px");
    }
}

var windowWidth;
var windowHeight;

function setImages(path) {
    var imgs = $('.kufr');
    var rows = $('.rows').val();
    var cols = $('.cols').val();

    var height = $(".thumb").height();
    var width = $(".thumb").width();
    var portrait;

    var widthHeightRatio = width / height;
    var cells = $(".cell");

    windowHeight = $(window).height() - $(".kufr").position().top - 30;
    windowWidth = $(window).width() - $(".kufr").position().left - 30;

    var widthShrink;
    if ((windowWidth / width) > (windowHeight / height))
        widthShrink = false;
    else
        widthShrink = true;

    var cellWidth;
    var cellHeight;
    if (widthShrink) {
        cellWidth = windowWidth / cols;
        cellHeight = cellWidth / widthHeightRatio;
    } else {
        cellHeight = windowHeight / rows;
        cellWidth = cellHeight * widthHeightRatio;
    }

    windowWidth = cellWidth * cols;
    windowHeight = cellHeight * rows;

    cells.width(cellWidth);
    cells.height(cellHeight);

    var imgs = $(".cell")

    imgs.css('background-image', "url(" + path + ")");
    imgs.css('background-size', windowWidth + "px");

    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            var selector = "#r" + r + "c" + c;
            var position = Math.floor(-cellWidth * c) + "px " + Math.floor(-cellHeight * r) + "px";
            $(selector).css('background-position', position);
        }
    }
}

function showAll() {
    var imgs = $(".cell");
    imgs.css('background-size', windowWidth + "px");
}

function hideAll() {
    var imgs = $(".cell");
    imgs.css('background-size', "0px");
}


