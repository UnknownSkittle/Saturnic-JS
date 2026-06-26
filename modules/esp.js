module.exports = {
    name: "ESP",
    category: "Render",

    settings: {
        players: { type: "bool", default: true },
        hostiles: { type: "bool", default: false },
        passives: { type: "bool", default: false },
        neutrals: { type: "bool", default: false },
        items: { type: "bool", default: false },
        crystals: { type: "bool", default: false },
        armorStands: { type: "bool", default: false },
        vehicles: { type: "bool", default: false },

        filled: { type: "bool", default: false }
    },

    onRender3D() {
        if (!player.self()) return

        for (let e of world.getEntities()) {
            if (e.isSelf()) continue
            if (!this.shouldRender(e)) continue

            let color = { r: 255, g: 50, b: 50, a: 180 }

            if (this.settings.filled) {
                render.boxFilled(e, color)
            } else {
                render.box(e, color, 1.0)
            }
        }
    },

    shouldRender(e) {
        if (this.settings.players && e.isPlayer())
            return true

        if (this.settings.hostiles && e.isHostile())
            return true

        if (this.settings.passives && e.isPassive())
            return true

        if (this.settings.neutrals &&
            e.isLiving() &&
            !e.isHostile() &&
            !e.isPassive() &&
            !e.isPlayer())
            return true

        if (this.settings.items && e.isItem())
            return true

        if (this.settings.crystals && e.isCrystal())
            return true

        if (this.settings.armorStands && e.isArmorStand())
            return true

        if (this.settings.vehicles && e.hasVehicle())
            return true

        return false
    }
}
