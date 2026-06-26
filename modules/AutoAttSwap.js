module.exports = {
    name: "AutoAttSwap",
    category: "Combat",

    settings: {
        swordMace: { type: "bool", default: true },
        breezeSpear: { type: "bool", default: true },
        axeSword: { type: "bool", default: false },
        bowMelee: { type: "bool", default: false },
        tridentMelee: { type: "bool", default: false },

        smartSwap: { type: "bool", default: true },
        smartRange: { type: "number", default: 4.0, min: 1.0, max: 10.0 },
        onlyWhenTargeting: { type: "bool", default: false },
        ignorePassive: { type: "bool", default: true },
        preferMace: { type: "bool", default: false },

        useOffhand: { type: "bool", default: false },

        onAttack: { type: "bool", default: true },
        onRightClick: { type: "bool", default: true },
        onBlockBreak: { type: "bool", default: false },

        pauseSwap: { type: "bool", default: true },
        packetSwap: { type: "bool", default: true },

        cooldownTicks: { type: "number", default: 3, min: 0, max: 10 }
    },

    swappedThisTick: false,
    cooldown: 0,

    onTick() {
        if (!player.self()) return

        if (this.settings.pauseSwap && player.isUsingItem()) return

        if (this.cooldown > 0) {
            this.cooldown--
            return
        }

        this.swappedThisTick = false

        let current = player.mainhand()

        // SMART SWAP LOGIC
        if (this.settings.smartSwap) {
            let target = this.getSmartTarget()
            if (target) {
                let dist = player.distanceTo(target)

                if (dist > this.settings.smartRange) {
                    if (this.settings.bowMelee) return this.doSwap("bow")
                    if (this.settings.tridentMelee) return this.doSwap("trident")
                } else {
                    if (this.settings.preferMace && player.hasHotbar("mace"))
                        return this.doSwap("mace")

                    return this.doSwapSword()
                }
            }
        }

        // EVENT-BASED SWAPS
        if (!this.swappedThisTick && this.settings.onAttack && player.isSwinging())
            this.trySwap(current)

        if (!this.swappedThisTick && this.settings.onRightClick && input.use())
            this.trySwap(current)

        if (!this.swappedThisTick && this.settings.onBlockBreak && input.attack())
            this.trySwap(current)
    },

    // -----------------------------
    // SMART TARGETING
    // -----------------------------
    getSmartTarget() {
        if (this.settings.onlyWhenTargeting && !player.isCrosshairEntity())
            return null

        let best = null
        let bestDist = 999

        for (let e of world.getEntities()) {
            if (!e.isLiving()) continue
            if (!e.isAlive()) continue
            if (e.isSelf()) continue
            if (e.isArmorStand()) continue
            if (e.isInvisible()) continue
            if (this.settings.ignorePassive && e.isPassive()) continue

            let dist = player.distanceTo(e)
            if (dist < bestDist) {
                bestDist = dist
                best = e
            }
        }

        return best
    },

    // -----------------------------
    // SWAP LOGIC
    // -----------------------------
    trySwap(current) {
        if (this.swappedThisTick) return

        if (this.settings.swordMace) {
            if (this.isSword(current)) return this.doSwap("mace")
            if (current === "mace") return this.doSwapSword()
        }

        if (this.settings.breezeSpear) {
            if (current === "wind_charge") return this.doSwap("spear")
            if (current === "spear") return this.doSwap("wind_charge")
        }

        if (this.settings.axeSword) {
            if (this.isAxe(current)) return this.doSwapSword()
            if (this.isSword(current)) return this.doSwap("axe")
        }

        if (this.settings.bowMelee) {
            if (current === "bow") return this.doSwapSword()
            if (this.isSword(current)) return this.doSwap("bow")
        }

        if (this.settings.tridentMelee) {
            if (current === "trident") return this.doSwapSword()
            if (this.isSword(current)) return this.doSwap("trident")
        }
    },

    // -----------------------------
    // SWAP HELPERS
    // -----------------------------
    doSwap(item) {
        if (player.hotbarHas(item)) {
            let slot = player.hotbarSlot(item)
            this.selectSlot(slot)
            return this.finishSwap()
        }

        if (this.settings.useOffhand && player.offhand() === item) {
            player.swapHands()
            return this.finishSwap()
        }
    },

    doSwapSword() {
        if (player.hotbarHas("sword")) {
            this.selectSlot(player.hotbarSlot("sword"))
            return this.finishSwap()
        }

        if (this.settings.useOffhand && this.isSword(player.offhand())) {
            player.swapHands()
            return this.finishSwap()
        }
    },

    selectSlot(slot) {
        if (player.selectedSlot() === slot) return

        player.setSelectedSlot(slot)

        if (this.settings.packetSwap)
            network.sendPacket("update_slot", slot)
    },

    finishSwap() {
        this.swappedThisTick = true
        this.cooldown = this.settings.cooldownTicks
    },

    // -----------------------------
    // ITEM CHECKS
    // -----------------------------
    isSword(item) {
        return item === "sword"
    },

    isAxe(item) {
        return item === "axe"
    }
}
