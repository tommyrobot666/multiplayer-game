input.onButtonPressed(Button.A, function () {
    music.play(music.tonePlayable(622, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
    if (0 > input.rotation(Rotation.Roll)) {
        player_x += -1
        if (0 > player_x) {
            player_x = 4
        }
    } else {
        player_x += 1
        if (4 < player_x) {
            player_x = 0
        }
    }
})
input.onButtonPressed(Button.AB, function () {
    music.play(music.tonePlayable(988, music.beat(BeatFraction.Whole)), music.PlaybackMode.InBackground)
    monster_host = true
})
input.onButtonPressed(Button.B, function () {
    music.play(music.tonePlayable(622, music.beat(BeatFraction.Sixteenth)), music.PlaybackMode.InBackground)
    if (0 > input.rotation(Rotation.Pitch)) {
        player_y += -1
        if (0 > player_y) {
            player_y = 4
        }
    } else {
        player_y += 1
        if (4 < player_y) {
            player_y = 0
        }
    }
})
radio.onReceivedValue(function (name, value) {
    tmp1 = name
    tmp2 = value
    if (parseFloat(tmp1) < 1) {
        if (tmp2 < 0) {
            if (amount_of_monsters < monster_xs.length - 1) {
                for (let index = 0; index < monster_xs.length - 1 - amount_of_monsters; index++) {
                    monster_xs.pop()
                    monster_ys.pop()
                }
            }
            amount_of_monsters = 0
        } else {
            amount_of_monsters = Math.abs(parseFloat(tmp1))
            if (tmp2 > 4) {
                monster_ys[Math.abs(parseFloat(tmp1))] = tmp2 - 5
            } else {
                monster_xs[Math.abs(parseFloat(tmp1))] = tmp2
            }
        }
    } else {
        if (plr_ids.indexOf(parseFloat(tmp1)) == -1) {
            plr_ids.push(parseFloat(tmp1))
            plr_ys.push(0)
            plr_xs.push(0)
        }
        if (tmp2 > 9) {
            tmp3 = plr_ids.indexOf(parseFloat(tmp1))
            plr_xs.removeAt(tmp3)
            plr_ys.removeAt(tmp3)
            plr_ids.removeAt(tmp3)
        } else if (tmp2 > 4) {
            plr_ys[plr_ids.indexOf(parseFloat(tmp1))] = tmp2 - 5
        } else {
            plr_xs[plr_ids.indexOf(parseFloat(tmp1))] = tmp2
        }
    }
})
let tmp3 = 0
let amount_of_monsters = 0
let tmp2 = 0
let tmp1 = ""
let monster_ys: number[] = []
let monster_xs: number[] = []
let plr_ids: number[] = []
let plr_ys: number[] = []
let plr_xs: number[] = []
let monster_host = false
let player_y = 0
let player_x = 0
radio.setGroup(165)
player_x = 2
player_y = 2
let player_id = parseFloat(convertToText(control.deviceSerialNumber()).substr(0, 3))
let player_health = 3
monster_host = false
plr_xs = []
plr_ys = []
plr_ids = []
let plr_healths: number[] = []
monster_xs = []
monster_ys = []
let screen_draw_time = 0
let send_death = 0
music.setBuiltInSpeakerEnabled(true)
music.play(music.stringPlayable("D G B D F A C C ", 120), music.PlaybackMode.InBackground)
basic.forever(function () {
    if (monster_host) {
        for (let index = 0; index <= monster_xs.length - 1; index++) {
            tmp3 = monster_xs[index]
            tmp2 = monster_ys[index]
            monster_xs[index] = tmp3 + randint(1, -1)
            monster_ys[index] = tmp2 + randint(1, -1)
            if (0 > tmp3) {
                monster_xs[index] = 4
            } else {
                if (4 < tmp3) {
                    monster_xs[index] = 0
                } else {
                    if (0 > tmp2) {
                        monster_ys[index] = 4
                    } else {
                        if (4 < tmp2) {
                            monster_ys[index] = 0
                        }
                    }
                }
            }
        }
        basic.pause(1000)
    }
})
basic.forever(function () {
    if (monster_host) {
        monster_xs.push(2)
        monster_ys.push(2)
        basic.pause(10000)
    }
})
basic.forever(function () {
    for (let index = 0; index <= monster_xs.length - 1; index++) {
        if (player_x == monster_xs[index] && player_y == monster_ys[index]) {
            player_health += -1
            music.play(music.stringPlayable("C C C D - - - - ", 441), music.PlaybackMode.UntilDone)
            basic.pause(2000)
        }
    }
})
basic.forever(function () {
    screen_draw_time += 1
    basic.clearScreen()
    for (let index = 0; index <= plr_xs.length - 1; index++) {
        led.plotBrightness(plr_xs[index], plr_ys[index], 70)
    }
    led.plot(player_x, player_y)
    if (screen_draw_time % 2 == 0) {
        for (let index = 0; index <= monster_xs.length - 1; index++) {
            led.plotBrightness(monster_xs[index], monster_ys[index], 100)
        }
    }
})
basic.forever(function () {
    if (0 < player_health) {
        basic.pause(200)
        radio.sendValue(convertToText(player_id), player_x)
        basic.pause(200)
        radio.sendValue(convertToText(player_id), player_y + 5)
    }
    if (monster_host) {
        basic.pause(200)
        for (let index = 0; index <= monster_xs.length - 1; index++) {
            radio.sendValue(convertToText(0 - index), monster_xs[index])
            basic.pause(100)
            radio.sendValue(convertToText(0 - index), monster_ys[index] + 5)
            basic.pause(100)
        }
        radio.sendValue(convertToText(0), -1)
    }
    if (0 < send_death) {
        radio.sendValue(convertToText(player_id), 10)
        basic.pause(500)
        send_death += -1
    }
})
basic.forever(function () {
    if (1 > player_health) {
        send_death = 3
        while (!(input.isGesture(Gesture.Shake))) {
            basic.showLeds(`
                . . . . .
                . # . # .
                . . . . .
                . # # # .
                # . . . #
                `)
        }
        control.reset()
    }
})
basic.forever(function () {
    if (player_health < 1) {
        pins.digitalWritePin(DigitalPin.P0, 0)
        pins.digitalWritePin(DigitalPin.P1, 0)
        pins.digitalWritePin(DigitalPin.P2, 0)
        basic.pause(100)
        pins.digitalWritePin(DigitalPin.P0, 1)
        pins.digitalWritePin(DigitalPin.P1, 1)
        pins.digitalWritePin(DigitalPin.P2, 1)
        basic.pause(100)
    } else {
        if (player_health == 3) {
            pins.digitalWritePin(DigitalPin.P0, 1)
            pins.digitalWritePin(DigitalPin.P1, 1)
            pins.digitalWritePin(DigitalPin.P2, 1)
        } else if (player_health == 2) {
            pins.digitalWritePin(DigitalPin.P0, 1)
            pins.digitalWritePin(DigitalPin.P1, 1)
            pins.digitalWritePin(DigitalPin.P2, 0)
        } else {
            pins.digitalWritePin(DigitalPin.P0, 1)
            pins.digitalWritePin(DigitalPin.P1, 0)
            pins.digitalWritePin(DigitalPin.P2, 0)
        }
    }
})
basic.forever(function () {
    if (player_health < 1) {
        music.play(music.tonePlayable(220, music.beat(BeatFraction.Breve)), music.PlaybackMode.InBackground)
        music.rest(music.beat(BeatFraction.Whole))
        music.play(music.tonePlayable(233, music.beat(BeatFraction.Breve)), music.PlaybackMode.InBackground)
        music.rest(music.beat(BeatFraction.Whole))
    }
})
