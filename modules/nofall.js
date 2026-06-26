module.exports = {
    name: "NoFall",
    category: "Player",

    settings: {
        mode: {
            type: "enum",
            default: "Packet",
            values: ["Packet", "Spoof", "OldNCP", "Matrix", "Collision"]
        },

        autoElytra: { type: "bool", default: true }
    },

    onTick() {
        if (!player.self()) return

        // Auto-Elytra logic
        if (this.settings.autoElytra && this.hasElytraEquipped() && player.fallDistance() > 2.5) {
            if (!player.isFallFlying())
                player.startFallFlying()
            return
        }

        switch (this.settings.mode) {
            case "Packet":
                this.handlePacket()
                break

            case "Spoof":
                this.handleSpoof()
                break

            case "OldNCP":
                this.handleOldNCP()
                break

            case "Matrix":
                this.handleMatrix()
                break

            case "Collision":
                this.handleCollision()
                break
        }
    },

    // ───────────────────────────────────────────────
    // PACKET MODE
    // ───────────────────────────────────────────────
    handlePacket() {
        if (player.fallDistance() > 2.5) {
            network.sendPacket("on_ground", true)
            player.resetFallDistance()
        }
    },

    // ───────────────────────────────────────────────
    // SPOOF MODE
    // ───────────────────────────────────────────────
    handleSpoof() {
        player.setOnGround(true)
        player.resetFallDistance()
    },

    // ───────────────────────────────────────────────
    // OLD NCP MODE
    // ───────────────────────────────────────────────
    handleOldNCP() {
        if (player.fallDistance() > 2.5) {
            network.sendPacket("position", {
                x: player.x(),
                y: player.y() + 0.0000001,
                z: player.z(),
                onGround: true
            })
            player.resetFallDistance()
        }
    },

    // ───────────────────────────────────────────────
    // MATRIX MODE
    // ───────────────────────────────────────────────
    handleMatrix() {
        if (player.fallDistance() > 2.5) {
            let vel = player.vel()
            player.setVelocity(vel.x, -0.1, vel.z)

            network.sendPacket("on_ground", true)
        }
    },

    // ───────────────────────────────────────────────
    // COLLISION MODE
    // ───────────────────────────────────────────────
    handleCollision() {
        if (player.fallDistance() > 2.5 && player.isTouchingWater()) {
            player.resetFallDistance()
        }
    },

    // ───────────────────────────────────────────────
    // ELYTRA CHECK
    // ───────────────────────────────────────────────
    hasElytraEquipped() {
        return player.armor(2) === "elytra"
    }
}
