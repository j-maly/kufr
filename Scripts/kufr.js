var files;
var fileIndex = 0;
var windowWidth;
var windowHeight;
var cellWidth;
var cellHeight;
var currentFile;

function handleFileSelect(evt) {
    files = evt.target.files;
    fileIndex = 0;
    showNextFile();
}

function showNextFile() {
    if (files.length == 0) {
        $("input.prev").attr("disabled", "disabled");
        $("input.next").attr("disabled", "disabled");
        return;
    }
    f = files[fileIndex];
    if (fileIndex == 0) {
        $("input.prev").attr("disabled", "disabled");    
    } else {
        $("input.prev").removeAttr("disabled", "disabled");
    }
    fileIndex++;
    if (fileIndex == files.length) {
        $("input.next").attr("disabled", "disabled");
    } else {
        $("input.next").removeAttr("disabled", "disabled");
    }    

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
            currentFile = e.target.result;
            createGrid();
        };
    })(f);

    // Read in the image file as a data URL.
    reader.readAsDataURL(f);
}

function createGrid() {
    makeButtons();
    setImages();
    hideAll();
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

function setImages() {
    determineDimensions();
    var cells = $(".cell");
    var rows = $('.rows').val();
    var cols = $('.cols').val();
    cells.width(cellWidth);
    cells.height(cellHeight);
    
    cells.css('background-image', "url(" + currentFile + ")");
    cells.css('background-size', windowWidth + "px");

    for (r = 0; r < rows; r++) {
        for (c = 0; c < cols; c++) {
            var selector = "#r" + r + "c" + c;
            var position = Math.floor(-cellWidth * c) + "px " + Math.floor(-cellHeight * r) + "px";
            $(selector).css('background-position', position);
        }
    }
}

function showAll() {
    var cells = $(".cell");
    cells.css('background-size', windowWidth + "px");
}

function hideAll() {
    var cells = $(".cell");
    cells.css('background-size', "0px");
}

function determineDimensions() {
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
    if ((windowWidth / width) > (windowHeight / height)) {
        widthShrink = false;
    } else {
        widthShrink = true;
    }

    if (widthShrink) {
        cellWidth = windowWidth / cols;
        cellHeight = cellWidth / widthHeightRatio;
    } else {
        cellHeight = windowHeight / rows;
        cellWidth = cellHeight * widthHeightRatio;
    }

    windowWidth = cellWidth * cols;
    windowHeight = cellHeight * rows;
}


