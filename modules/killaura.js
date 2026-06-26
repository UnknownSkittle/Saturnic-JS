module.exports = {
    name: "KillAura",
    category: "Combat",

    settings: {
        range: {
            type: "number",
            default: 4.5,
            min: 1,
            max: 6
        },
        delay: {
            type: "number",
            default: 300
        }
    },

    onEnable() {
        chat.print("KillAura enabled")
        this.lastAttack = 0
    },

    onTick() {
        let target = world.getPlayers()
            .filter(p => p !== player.self())
            .filter(p => player.distanceTo(p) <= this.settings.range)
            .sort((a,b) => player.distanceTo(a) - player.distanceTo(b))[0]

        if (!target) return

        if (system.time() - this.lastAttack >= this.settings.delay) {
            player.attack(target)
            this.lastAttack = system.time()
        }
    }
}
