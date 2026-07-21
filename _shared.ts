/**
 * _shared.ts — 全系列共用的內部工具
 *
 * 這個命名空間不含 //% block 註解，所以不會出現在工具箱，
 * 只給其他系列檔案（pyramid.ts、maze.ts…）呼叫。
 */
namespace csps {

    /** 座標位移：回傳 p 平移 (dx, dy, dz) 後的世界座標 */
    export function offset(p: Position, dx: number, dy: number, dz: number): Position {
        const w = p.toWorld()
        return world(
            w.getValue(Axis.X) + dx,
            w.getValue(Axis.Y) + dy,
            w.getValue(Axis.Z) + dz
        )
    }

    /** 以 material 填滿 base 平移後的長方體區域（常用捷徑） */
    export function fillBox(
        material: number, base: Position,
        x1: number, y1: number, z1: number,
        x2: number, y2: number, z2: number
    ): void {
        blocks.fill(
            material,
            offset(base, x1, y1, z1),
            offset(base, x2, y2, z2),
            FillOperation.Replace
        )
    }
}
