//-------------
//- Author: Huiwen Hong -
//- huiwen.hong@gmail.com -
//-------------

/*==============================================*/
/*========= Bind Elements to Actions ===========*/
/*==============================================*/

//Define elements
var eleList = {
    puzzleTable: $("table.puzzle"),
    solutionTable: $("table.solution"),
    importButton: $("button.import"),
    importModal: $(".import-modal"),
    importInput: $("input.importstr"),
    errorModal: $(".error-modal"),
    pendingModal: $(".pending-modal"),
}

//Define actions
var actionList = {
    "import_show": function (e) {
        //show the import modal
        eleList.importModal.addClass("visible");
    },
    "import_hide": function (e) {
        //hide the import modal
        if ($(e.target).is(".import-modal.visible")) {
            e.preventDefault();
            eleList.importModal.removeClass("visible");
            eleList.importInput.val("");
            eleList.importInput.removeClass("error");
        }
    },
    "import_submit": function (e) {
        //check string length before importing a string
        if (eleList.importInput.val().length !== 81) {
            eleList.importInput.addClass("error");
        } else {
            clearTable("solution");
            renderPuzzleTable(eleList.importInput.val());
            eleList.importModal.trigger("click");
        }
    },
    "solve": function (e) {
        clearTable("solution");
        //get puzzle string
        var puzzleStr = getPuzzleString();
        log("Solving:\n" + matrixToString(stringToMatrix(puzzleStr)).forPrint);
        //get puzzle solution
        var sudoku = new Sudoku(stringToMatrix(puzzleStr));
        if (sudoku.solveIt()) {
            //render in solution table if solved
            renderSolutionTable(sudoku);
            log("Puzzle solverd!");
            log("Solution:\n" + matrixToString(sudoku.solving_matrix).forPrint);
        } else {
            //show error info table if not solved
            eleList.errorModal.addClass("visible");
            setTimeout(function () {
                eleList.errorModal.removeClass("visible");
            }, 1500);
        }
        log("==================");
    },
    "random": function (e) {
        clearTable("solution");
        //show a random puzzle already defined in testcases
        var str = testcases[testFlag].puzzle;
        testFlag = (testFlag + 1) % testcases.length;
        renderPuzzleTable(str);
    }
};

//Bind click events to respective actions
$(document.body).on("click", "[data-action]", function (e) {
    var actionName = $(this).data("action");
    var action = actionList[actionName];
    if ($.isFunction(action)) {
        action(e);
    }
});

//Bind input focus events to its actions(remove the red outline)
eleList.importInput.on("focus", function () {
    eleList.importInput.removeClass("error");
});

/*JS to extend a new action
$.extend(actionList, {
    "more-action": function () {
        ......
    }
});*/


/*==============================================*/
/*==============Actions in Tables===============*/
/*==============================================*/

//initialize blank tables
var initTable = function (opt) {
    var innerHTML = "";
    for (var i = 0; i < 9; i++) {
        innerHTML += "<tr>";
        for (var j = 0; j < 9; j++) {
            innerHTML += "<td></td>";
        }
        innerHTML += "</tr>";
    }
    switch (opt) {
    case "puzzle":
        eleList.puzzleTable.html(innerHTML);
        break;
    case "solution":
        eleList.solutionTable.html(innerHTML);
        break;
    case "both":
        eleList.puzzleTable.html(innerHTML);
        eleList.solutionTable.html(innerHTML);
        break;
    default:
        break;
    }
}

//render puzzle table with a string or matrix
var renderPuzzleTable = function (m) {
    if ($.type(m) === "string") {
        m = stringToMatrix(m);
    }
    eleList.puzzleTable.children().each(function (r) {
        $(this).children().each(function (c) {
            $(this).html(m[r][c] == 0 ? "" : m[r][c]);
        });
    });
};

//render solution table with a sudoku object to show the algorithm result
var renderSolutionTable = function (sudoku) {
    eleList.solutionTable.children().each(function (r) {
        $(this).children().each(function (c) {
            if (sudoku.original_matrix[r][c] == 0) {
                $(this).html(sudoku.solving_matrix[r][c]);
                $(this).addClass("solution");
            } else {
                $(this).html(sudoku.solving_matrix[r][c]);
            }
        });
    });
}

var getPuzzleString = function () {
    var str = "";
    $.each($("table.puzzle > tr > td"), function () {
        str += $(this).html() === "" ? "0" : $(this).html();
    });
    return str;
}

//set table to be blank
var clearTable = function (opt) {
    var table;
    if (opt === "puzzle") {
        table = eleList.puzzleTable;
    } else if (opt === "solution") {
        table = eleList.solutionTable;
    }
    table.children().each(function () {
        $(this).children().each(function () {
            $(this).html("");
            if (opt === "solution") {
                $(this).removeClass("solution");
            }
        });
    });
}


/*==============================================*/
/*==============Other Functions=================*/
/*==============================================*/

//easy way to print in console
var log = function (str) {
    console.log(str);
};

//set table size to be square and same as card
var setTableSize = function () {
    $(".card").css("height", $(".card").css("width"));
    //    $("table").css("width", $(".card").css("width"));
    //    $("table").css("height", $(".card").css("height"));
    $(window).resize(function () {
        $(".card").css("height", $(".card").css("width"));
        //        $("table").css("width", $(".card").css("width"));
        //        $("table").css("height", $(".card").css("height"));
    });
}

//convert string(81) to matrix[9][9]
var stringToMatrix = function (str) {
    var matrix = [];
    if (str.length !== 81) {
        alert("String invalid!");
    } else {
        for (var i = 0; i < 9; i++) {
            var subStr = str.substr(i * 9, 9).split("");
            for (var j = 0; j < 9; j++) {
                if (!$.isNumeric(subStr[j])) {
                    subStr[j] = 0;
                }
            }
            matrix.push(subStr);
        }
    }
    return matrix;
}

//convert matrix[9][9] to string(81)
var matrixToString = function (m) {
    var forInput = "",
        forPrint = "";
    for (var i = 0; i < 9; i++) {
        for (var j = 0; j < 9; j++) {
            forPrint += m[i][j] + " ";
            forInput += m[i][j];
        }
        forPrint += "\n";
    }
    return {
        forPrint: forPrint,
        forInput: forInput
    };
}