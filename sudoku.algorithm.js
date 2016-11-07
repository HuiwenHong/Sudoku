//-------------
//- Author: Huiwen Hong -
//- huiwen.hong@gmail.com -
//-------------

/*==============================================*/
/*======= SUDOKU Algorithm (Backtracking) ======*/
/*==============================================*/
function Sudoku(s) {
    if ($.type(s) === "string") {
        s = stringToMatrix(s);
    }
    this.original_matrix = JSON.parse(JSON.stringify(s));
    this.solving_matrix = JSON.parse(JSON.stringify(s));
};

/**Check validation in Row/Column/Box/All Three**/
Sudoku.prototype.isValidInRow = function (r, c) {
    for (var j = 0; j < 9; j++) {
        if ((j != c) && this.solving_matrix[r][j] == this.solving_matrix[r][c]) {
            return false;
        }
    }
    return true;
};
Sudoku.prototype.isValidInCol = function (r, c) {
    for (var i = 0; i < 9; i++) {
        if ((i != r) && this.solving_matrix[i][c] == this.solving_matrix[r][c]) {
            return false;
        }
    }
    return true;
};
Sudoku.prototype.isValidInBox = function (r, c) {
    var value = this.solving_matrix[r][c];
    var _r = Math.floor(r / 3) * 3;
    var _c = Math.floor(c / 3) * 3;

    for (var i = 0; i < 3; i++) {
        for (var j = 0; j < 3; j++) {
            if ((_r + i != r) && (_c + j != c) && this.solving_matrix[_r + i][_c + j] == value) {
                return false;
            }
        }
    }
    return true;
};
Sudoku.prototype.isValidTrying = function (r, c) {
    return this.isValidInRow(r, c) && this.isValidInCol(r, c) && this.isValidInBox(r, c);
};

/*The backtracking process*/
Sudoku.prototype.backtracking = function (r, c) {
    c++; //Go to the next cell
    if (c > 8) { //Jump to the next row when reaching the end of the column
        c = 0;
        r++;
        if (r > 8) { //Backtracking ends when reaching the end of the table
            return true;
        }
    }

    if (this.solving_matrix[r][c] != 0) { //Go to the next cell if the cell is not blank
        if (!this.isValidTrying(r, c)) {
            return false;
        }
        return this.backtracking(r, c);
    } else { //Go through all possible numbers if the cell is blank
        for (var k = 1; k <= 9; k++) {
            this.solving_matrix[r][c] = k;
            if (this.isValidTrying(r, c)) {
                if (this.backtracking(r, c)) {
                    return true;
                }
            }
        }
        //Set the cell blank if no valid solution
        this.solving_matrix[r][c] = 0;
        return false;
    }
};

/*Solve the sudoku puzzle*/
Sudoku.prototype.solveIt = function () {
    //Check valiadation for the original puzzle matrix
    for (var r = 0; r < 9; r++) {
        for (var c = 0; c < 9; c++) {
            if (this.original_matrix[r][c] != 0 && !this.isValidTrying(r, c)) {
                return false;
            }
        }
    }
    //Do the backtracking
    return this.backtracking(0, -1);
};

/*==============================================*/
/*==== SUDOKU Algorithm Testcases and Test =====*/
/*==============================================*/
var testcases = [
    {
        "puzzle": "5HFC27DIAGB1IDE36H9DC6HAGB5AE47IF83BHGBA3DIEFC69BE81GD2CEHA9FD7D17EFC2HIFIH47BEA3",
        "solution": "586327491721945368943681725154796832872134956369258174235819647417563289698472513"
    }, {
        "puzzle": "EH63BGDIA72194ECFHI4CF81GBEAE4GIFHC28GB1C4IE63FIBEH1GDBCE81IF4GDAGE63289FIHDG25AC",
        "solution": "586327491721945368943681725154796832872134956369258174235819647417563289698472513"
    }, {
        "puzzle": "HAB75DIC63FI8BAEG4DEGCF912HG8EBIFCD1B31D8E69G9DFACGH5BE749AHBFC6BHED3GA91ICF72DHE",
        "solution": "812754936369821574457369128785296341231485697946137852574918263628543719193672485"
    }, {
        "puzzle": "000007090021000000903001000054090000800104006000050170000800607000000280090400000",
        "solution": "586327491721945368943681725154796832872134956369258174235819647417563289698472513"
    }, {
        "puzzle": "HABGEDICF3FIH2AE744EG3FI128G8EBI6CD1BC1D8E6IG9DF1CGH5B574IA8BF362HE4CGA9AICFGBDHE",
        "solution": "812754936369821574457369128785296341231485697946137852574918263628543719193672485"
    }, {
        "puzzle": "E8FC2G4IA7BAIDEC68I43FH17BEAEDGIF832HGBACDIEF369BEHAGDBC58AI64G41GEFCBH9FI8D7BE1C",
        "solution": "586327491721945368943681725154796832872134956369258174235819647417563289698472513"
    }, {
        "puzzle": "AHEGC2IFD7CD9E6H1BIB6A847E364GHB9AC55ICD6ABH72AH5GCD963G964H5BAH5B3A7FD9DFA2IECGH",
        "solution": "185732964734956812926184753647829135593461287218573496379648521852317649461295378"
    }, {
        "puzzle": "ECB91F4GHA4H2CG6IEFGIH543212AGFIC5H4DEF7H2ACI9H3EDAGF286132EIDGCI4AG8B5FGB5D69HAC",
        "solution": "532916478148237695679854321217693584456782139983541762861325947394178256725469813"
    }, {
        "puzzle": "000008050002904007805000409000007035000509000750800000308000204500706800070200000",
        "solution": "497318652612954387835672419289467135146539728753821946368195274521746893974283561"
    },
    {
        "puzzle": "005300006800060041000074200018020004000406000900830510006100005403050007100003600",
        "solution": "245381976879265341631974258318529764527416893964837512786192435493658127152743689"
    },
    {
        "puzzle": "006235000920000000005100032400013000070000090000750008230008700000000085000467900",
        "solution": "716235849923846157845179632482913576571682394369754218234598761697321485158467923"
    }, {
        "puzzle": "005020700430100008000060020008000009050208060900006800040080000300002074007050300",
        "solution": "695823741432179658871465923768541239153298467924736815546387192389612574217954386"
    },
    {
        "puzzle": "001020046000960810030100000300007290005000700019200003000005030040000000280030400",
        "solution": "971528346452963817638174925364857291825319764719246583197485632543692178286731459"
    },
    {
        "puzzle": "300006010040830700020100000850070900200903005004000027000005030009068070030200009",
        "solution": "397426518145839762628157493853672941271943685964581327482795136519368274736214859"
    },
    {
        "puzzle": "806070000020100030040902000750000020260000093090700068000609050070001080000080206",
        "solution": "816375942927148635345962871753896124268514793491723568182639457674251389539487216"
    }];
var testFlag = 0;

var runTest = function () {
    for (var i = 0; i < testcases.length - 1; i++) {
        var sudoku = new Sudoku(testcases[i].puzzle);
        if (sudoku.solveIt()) {
            if (matrixToString(sudoku.solving_matrix).forInput == testcases[i].solution) {
                log("Test " + (i + 1) + " pass[1]");
            } else {
                log("Test " + (i + 1) + " error[1]");
            }
        } else {
            if (testcases[i].solution == "none") {
                log("Test " + (i + 1) + " pass[2]");
            } else {
                log("Test " + (i + 1) + " error[2]");
            }
        }
    }
}