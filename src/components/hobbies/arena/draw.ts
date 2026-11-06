import { H, ROUND, W } from './logic'
import type { ArenaGame, Hazard } from './logic'

const clamp = (v: number, min: number, max: number) => Math.max(min, Math.min(max, v))

function polygon(ctx: CanvasRenderingContext2D, points: [number, number][]) {
  ctx.beginPath()
  points.forEach((p, i) => (i ? ctx.lineTo(p[0], p[1]) : ctx.moveTo(p[0], p[1])))
  ctx.closePath()
}

function arenaShape(ctx: CanvasRenderingContext2D, inset = 0) {
  const x = 20 + inset, y = 20 + inset, right = W - x, bottom = H - y, cut = 30
  polygon(ctx, [[x + cut, y], [right - cut, y], [right, y + cut], [right, bottom - cut], [right - cut, bottom], [x + cut, bottom], [x, bottom - cut], [x, y + cut]])
}

function drawBackground(ctx: CanvasRenderingContext2D, game: ArenaGame) {
  const reducedMotion = game.reducedMotion
  const bg = ctx.createLinearGradient(0, 0, W, H); bg.addColorStop(0, '#183947'); bg.addColorStop(.55, '#102832'); bg.addColorStop(1, '#0c1c29')
  ctx.fillStyle = bg; ctx.fillRect(0, 0, W, H)
  arenaShape(ctx); ctx.fillStyle = '#112b36'; ctx.fill(); ctx.strokeStyle = '#a68b5780'; ctx.lineWidth = 1; ctx.stroke()
  arenaShape(ctx, 8); ctx.strokeStyle = '#628c9c27'; ctx.stroke()
  ctx.save(); arenaShape(ctx, 11); ctx.clip()
  ctx.strokeStyle = '#78abb610'; ctx.lineWidth = 1
  for (let x = -H; x < W + H; x += 56) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x + H, H); ctx.stroke(); ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x - H, H); ctx.stroke() }
  const light = ctx.createRadialGradient(W / 2, H / 2, 12, W / 2, H / 2, 420); light.addColorStop(0, '#4a91a00d'); light.addColorStop(1, '#04121c55'); ctx.fillStyle = light; ctx.fillRect(0, 0, W, H)
  ctx.restore()
  for (const r of [65, 92, 100]) { ctx.beginPath(); ctx.arc(W / 2, H / 2, r, 0, Math.PI * 2); ctx.strokeStyle = r === 92 ? '#ceb47730' : '#6fa0ae22'; ctx.stroke() }
  ctx.save(); ctx.translate(W / 2, H / 2); ctx.rotate(Math.PI / 4); ctx.strokeStyle = '#d8ba761c'; ctx.strokeRect(-44, -44, 88, 88); ctx.strokeRect(-38, -38, 76, 76); ctx.restore()
  for (const [x, y, rotation] of [[72, 72, Math.PI / 4], [W - 72, 72, 3 * Math.PI / 4], [72, H - 72, -Math.PI / 4], [W - 72, H - 72, -3 * Math.PI / 4]]) {
    ctx.save(); ctx.translate(x, y); ctx.rotate(rotation); ctx.fillStyle = '#1a4350'; ctx.strokeStyle = '#80b4c459'
    polygon(ctx, [[-12, -17], [12, -17], [18, 0], [0, 22], [-18, 0]]); ctx.fill(); ctx.stroke()
    ctx.fillStyle = '#79cade'; ctx.shadowColor = '#68c7df'; ctx.shadowBlur = reducedMotion ? 0 : 15
    polygon(ctx, [[0, -8], [6, 0], [0, 10], [-6, 0]]); ctx.fill(); ctx.restore()
  }
  ctx.fillStyle = '#9bc0cb66'; ctx.font = '9px monospace'; ctx.textAlign = 'left'; ctx.fillText('FOOTWORK / TRAINING GROUNDS', 56, 47)
  ctx.textAlign = 'right'; ctx.fillStyle = '#cfb77d88'; ctx.fillText(`WAVE ${String(Math.max(1, Math.ceil(game.elapsed / 15))).padStart(2, '0')}`, W - 56, 47)
}

function drawHazard(ctx: CanvasRenderingContext2D, h: Hazard, reducedMotion: boolean) {
  const charge = clamp(h.age / h.warning, 0, 1), active = h.age >= h.warning
  ctx.save(); ctx.lineCap = 'round'
  if (h.type === 'line') {
    if (!active) {
      const end = { x: h.x + h.dx * 1200, y: h.y + h.dy * 1200 }
      ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.lineTo(end.x, end.y); ctx.strokeStyle = `rgba(226,189,120,${.13 + charge * .23})`; ctx.lineWidth = 18; ctx.stroke()
      ctx.setLineDash([8, 9]); ctx.strokeStyle = `rgba(245,208,140,${.4 + charge * .5})`; ctx.lineWidth = 1.3; ctx.stroke(); ctx.setLineDash([])
      ctx.beginPath(); ctx.arc(h.x, h.y, 11 + charge * 8, 0, Math.PI * 2); ctx.strokeStyle = '#efc47d'; ctx.stroke()
    } else {
      ctx.strokeStyle = '#e9bc76'; ctx.lineWidth = 7; ctx.shadowColor = '#d6ad65'; ctx.shadowBlur = reducedMotion ? 0 : 15
      ctx.beginPath(); ctx.moveTo(h.x - h.dx * 28, h.y - h.dy * 28); ctx.lineTo(h.x, h.y); ctx.stroke()
      ctx.fillStyle = '#fff1cb'; ctx.beginPath(); ctx.arc(h.x, h.y, 4.5, 0, Math.PI * 2); ctx.fill()
    }
  } else if (h.type === 'circle') {
    ctx.beginPath(); ctx.arc(h.x, h.y, h.radius, 0, Math.PI * 2); ctx.fillStyle = active ? '#df8aab70' : `rgba(204,112,152,${.06 + charge * .18})`; ctx.fill()
    ctx.strokeStyle = active ? '#f4b4cf' : '#c77d9d'; ctx.lineWidth = active ? 2 : 1.5; ctx.stroke()
    if (!active) {
      ctx.beginPath(); ctx.arc(h.x, h.y, h.radius * charge, -Math.PI / 2, Math.PI * 1.5); ctx.strokeStyle = '#efb0cdb0'; ctx.lineWidth = 2; ctx.stroke()
      ctx.strokeStyle = '#e3a0bb85'; ctx.beginPath(); ctx.moveTo(h.x - 7, h.y); ctx.lineTo(h.x + 7, h.y); ctx.moveTo(h.x, h.y - 7); ctx.lineTo(h.x, h.y + 7); ctx.stroke()
    } else {
      ctx.beginPath(); ctx.arc(h.x, h.y, h.radius * (1 + (h.age - h.warning) * .5), 0, Math.PI * 2); ctx.strokeStyle = '#f3b8d150'; ctx.stroke()
    }
  } else {
    ctx.beginPath(); ctx.moveTo(h.x, h.y); ctx.arc(h.x, h.y, h.radius, h.angle - h.spread, h.angle + h.spread); ctx.closePath()
    ctx.fillStyle = active ? '#7bd0df70' : `rgba(111,182,201,${.06 + charge * .15})`; ctx.fill(); ctx.strokeStyle = active ? '#9fe5ed' : '#73aebb'; ctx.lineWidth = active ? 2 : 1; ctx.stroke()
    if (!active) {
      ctx.save(); ctx.clip(); ctx.strokeStyle = '#92c4cf2d'
      for (let i = 20; i < h.radius; i += 26) { ctx.beginPath(); ctx.arc(h.x, h.y, i, 0, Math.PI * 2); ctx.stroke() }
      ctx.restore()
    }
  }
  ctx.restore()
}

function drawPlayer(ctx: CanvasRenderingContext2D, game: ArenaGame) {
  const { player, target, trails, moveMarker, reducedMotion } = game
  if (moveMarker > 0 && Math.hypot(target.x - player.x, target.y - player.y) > 12) {
    ctx.save(); ctx.globalAlpha = Math.min(.65, moveMarker); ctx.strokeStyle = '#e2bd78'; ctx.lineWidth = 1.3
    ctx.beginPath(); ctx.arc(target.x, target.y, 9, 0, Math.PI * 2); ctx.stroke()
    ctx.beginPath(); ctx.moveTo(target.x - 13, target.y); ctx.lineTo(target.x - 5, target.y); ctx.moveTo(target.x + 5, target.y); ctx.lineTo(target.x + 13, target.y)
    ctx.moveTo(target.x, target.y - 13); ctx.lineTo(target.x, target.y - 5); ctx.moveTo(target.x, target.y + 5); ctx.lineTo(target.x, target.y + 13); ctx.stroke(); ctx.restore()
  }
  for (const trail of trails) { ctx.save(); ctx.globalAlpha = trail.life / .28 * .35; ctx.fillStyle = '#70ddf3'; ctx.beginPath(); ctx.arc(trail.x, trail.y, player.radius, 0, Math.PI * 2); ctx.fill(); ctx.restore() }
  ctx.save(); ctx.translate(player.x, player.y)
  ctx.fillStyle = '#0004'; ctx.beginPath(); ctx.ellipse(0, 12, 17, 6, 0, 0, Math.PI * 2); ctx.fill()
  const blinking = player.invincible > 0 && !reducedMotion && Math.floor(player.invincible * 14) % 2 === 0
  ctx.globalAlpha = blinking ? .45 : 1
  if (player.invincible > 0) { ctx.beginPath(); ctx.arc(0, 0, 19, 0, Math.PI * 2); ctx.strokeStyle = '#d1eef9aa'; ctx.lineWidth = 1.4; ctx.stroke() }
  ctx.rotate(player.facing + Math.PI / 2); ctx.shadowColor = '#75d7ef'; ctx.shadowBlur = reducedMotion ? 0 : 12
  polygon(ctx, [[0, -15], [10, 3], [8, 13], [0, 8], [-8, 13], [-10, 3]]); ctx.fillStyle = '#58afca'; ctx.fill(); ctx.strokeStyle = '#b9e4e9'; ctx.lineWidth = 1.3; ctx.stroke(); ctx.shadowBlur = 0
  ctx.beginPath(); ctx.arc(0, -5, 5.6, 0, Math.PI * 2); ctx.fillStyle = '#dceff0'; ctx.fill(); ctx.strokeStyle = '#e2bd78'; ctx.lineWidth = 1; ctx.stroke()
  ctx.strokeStyle = '#e7c788'; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.moveTo(-10, -2); ctx.lineTo(-14, 8); ctx.moveTo(10, -2); ctx.lineTo(14, 8); ctx.stroke(); ctx.restore()
}

/** Draw the whole arena for the given pixel buffer size. */
export function drawArena(ctx: CanvasRenderingContext2D, game: ArenaGame, pixelWidth: number, pixelHeight: number) {
  ctx.setTransform(pixelWidth / W, 0, 0, pixelHeight / H, 0, 0)
  ctx.clearRect(0, 0, W, H)
  drawBackground(ctx, game)
  game.hazards.forEach(h => drawHazard(ctx, h, game.reducedMotion))
  drawPlayer(ctx, game)
  game.particles.forEach(p => { ctx.globalAlpha = Math.max(0, p.life / .55); ctx.fillStyle = p.color; ctx.fillRect(p.x - 1.5, p.y - 1.5, 3, 3) })
  ctx.globalAlpha = 1
  const fraction = clamp(game.elapsed / ROUND, 0, 1)
  ctx.fillStyle = '#78b8c91a'; ctx.fillRect(50, H - 35, W - 100, 2)
  ctx.fillStyle = '#e2bd78'; ctx.fillRect(50, H - 35, (W - 100) * fraction, 2)
}
