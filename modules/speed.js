module.exports = {
    name: "Speed",
    category: "Movement",

    settings: {
        multiplier: {
            type: "number",
            default: 1.2,
            min: 1.0,
            max: 3.0
        }
    },

    onEnable() {
        chat.print("Speed enabled")
    },

    onDisable() {
        chat.print("Speed disabled")
    },

    onTick() {
        player.setSpeed(this.settings.multiplier)
    }
}
