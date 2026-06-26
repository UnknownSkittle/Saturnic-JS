module.exports = {
    name: "BlockHighlight",
    category: "Render",

    onRender3D() {
        let hit = player.crosshair()

        // highlight blocks
        if (!hit || hit.type !== "block")
            return

        let pos = hit.blockPos

        // Get block shape (collision box)
        let shape = world.blockShape(pos)
        if (!shape || shape.isEmpty())
            return

        // Get bounding box and offset it
        let box = shape.box().offset(pos.x, pos.y, pos.z)

        // Draw box
        render.box(box, { r: 255, g: 0, b: 0, a: 255 }, 1.0)
    }
}
