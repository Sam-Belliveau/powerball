
class BallData {
    constructor(min, max) {
        this.min = Math.min(min, max)
        this.max = Math.max(min, max)
    }

    random() {
        return CryptoGen.getRange(this.min, this.max + 1)
    }

    cap(n) {
        if(n < this.min) return this.min
        if(n > this.max) return this.max
        return n
    }
}

WhiteBall = new BallData(1, 69)
RedBall = new BallData(1, 26)


class BallSet {
    constructor(b1, b2, b3, b4, b5, red) {
        this.whites = [
            WhiteBall.cap(b1),
            WhiteBall.cap(b2),
            WhiteBall.cap(b3),
            WhiteBall.cap(b4),
            WhiteBall.cap(b5)
        ]
        this.red = RedBall.cap(red)
    }

    checkLevel(other) {
        var mRed = this.red == other.red
        var mWhite = 0

        // Count number of matching whites
        // Its a little bit complicated
        var pick = other.whites.slice()
        for(const ball of this.whites) {
            for(var i = 0; i < pick.length; ++i) {
                if(ball == pick[i] && pick[i] != -1) {
                    mWhite += 1
                    pick[i] = -1
                    break;
                }
            }
        }

        switch(mWhite) {
            case 0: return mRed ? 1 : 0
            case 1: return mRed ? 1 : 0
            case 2: return mRed ? 2 : 0
            case 3: return mRed ? 3 : 2
            case 4: return mRed ? 4 : 3
            case 5: return mRed ? 6 : 5
            default: return 0
        }
    }

    checkPrize(prize) {
        var prizes = [0, 4, 7, 100, 50000, 1000000, 1000000000]
        return prizes[this.checkLevel(prize)]
    }

    get text() {
        function format(n) {
            if(n < 10) {
                return "0" + n + " "
            } else {
                return n + " "
            }
        }

        return  format(this.whites[0]) +
                format(this.whites[1]) +
                format(this.whites[2]) +
                format(this.whites[3]) +
                format(this.whites[4]) +
                "[ " + format(this.red) + "]"
    }
}

function getRandomBallSet() {
    return new BallSet(
        WhiteBall.random(), WhiteBall.random(),
        WhiteBall.random(), WhiteBall.random(),
        WhiteBall.random(), RedBall.random()
    )
}

function getBallSetFromUser() {
    var balls = document.getElementById("ball-entry")
    return new BallSet(
        document.getElementById("wball1").value,
        document.getElementById("wball2").value,
        document.getElementById("wball3").value,
        document.getElementById("wball4").value,
        document.getElementById("wball5").value,
        document.getElementById("redball").value,
    )
}

var GameState = {
    pick: getRandomBallSet(),
    user: getBallSetFromUser(),
    money: 0,
    earned: 0,
    spent: 0,

    round: function() {
        this.pick = getRandomBallSet()
        this.user = getBallSetFromUser()
        this.money -= 20
        this.spent += 20
        this.money += this.prize
        this.earned += this.prize
    },

    get prize() {
        return this.user.checkPrize(this.pick)
    }
}