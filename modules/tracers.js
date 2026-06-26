module.exports = {
    name: "Tracers",
    category: "Render",

    settings: {
        targets: { type: "string", default: "Player" },
        useList: { type: "bool", default: false },
        autoPopulate: { type: "bool", default: true }
    },

    targetList: [],

    onRender3D() {
        if (!player.self()) return

        // Auto-populate target list
        if (this.settings.autoPopulate && this.settings.useList)
            this.populateTargets()

        let targs = this.settings.targets.toLowerCase()

        for (let p of world.getPlayers()) {
            if (p.isSelf()) continue
            if (!p.isAlive()) continue

            let draw = targs.includes("player")

            if (this.settings.useList) {
                let name = p.name()
                draw = this.targetList.includes(name) || this.targetList.includes("Player")
            }

            if (!draw) continue

            // Color
            let c = { r: 255, g: 50, b: 50, a: 255 }

            // Camera -->> entity line
            let cam = render.cameraPos()
            let pos = p.pos()

            render.line(
                cam.x, cam.y, cam.z,
                pos.x, pos.y, pos.z,
                c
            )
        }
    },

    populateTargets() {
        this.targetList = []

        for (let p of world.getPlayers()) {
            let name = p.name()
            if (!this.targetList.includes(name))
                this.targetList.push(name)
        }
    }
}
