import { describe, it, expect, beforeEach } from 'vitest'
import ChessService from '../ChessService.js'

describe('ChessService', () => {
  let service

  beforeEach(() => {
    service = new ChessService()
  })

  describe('getBoard', () => {
    it('retourne un plateau 8x8', () => {
      const board = service.getBoard()
      expect(board).toHaveLength(8)
      board.forEach(row => expect(row).toHaveLength(8))
    })

    it('les rangées 2 à 5 sont vides au départ', () => {
      const board = service.getBoard()
      for (let row = 2; row <= 5; row++) {
        for (let col = 0; col < 8; col++) {
          expect(board[row][col]).toBeNull()
        }
      }
    })
  })

  describe('getPieceAt', () => {
    it('retourne la tour noire en a8 (0,0)', () => {
      const piece = service.getPieceAt(0, 0)
      expect(piece).not.toBeNull()
      expect(piece.symbol).toBe('♜')
      expect(piece.color).toBe('black')
    })

    it('retourne le roi blanc en e1 (7,4)', () => {
      const piece = service.getPieceAt(7, 4)
      expect(piece).not.toBeNull()
      expect(piece.symbol).toBe('♔')
      expect(piece.color).toBe('white')
    })

    it('retourne un pion noir en d7 (1,3)', () => {
      const piece = service.getPieceAt(1, 3)
      expect(piece).not.toBeNull()
      expect(piece.symbol).toBe('♟')
      expect(piece.color).toBe('black')
    })

    it('retourne un pion blanc en d2 (6,3)', () => {
      const piece = service.getPieceAt(6, 3)
      expect(piece).not.toBeNull()
      expect(piece.symbol).toBe('♙')
      expect(piece.color).toBe('white')
    })

    it('retourne null pour une case vide', () => {
      expect(service.getPieceAt(4, 4)).toBeNull()
    })

    it('retourne null pour des coordonnées hors limites', () => {
      expect(service.getPieceAt(8, 0)).toBeNull()
      expect(service.getPieceAt(-1, 0)).toBeNull()
    })
  })

  describe('getAllPieces', () => {
    it('retourne 32 pièces au départ', () => {
      const pieces = service.getAllPieces()
      expect(pieces).toHaveLength(32)
    })

    it('retourne 16 pièces blanches et 16 noires', () => {
      const pieces = service.getAllPieces()
      const whites = pieces.filter(p => p.color === 'white')
      const blacks = pieces.filter(p => p.color === 'black')
      expect(whites).toHaveLength(16)
      expect(blacks).toHaveLength(16)
    })

    it('chaque pièce a un nom, un symbole et une position', () => {
      const pieces = service.getAllPieces()
      pieces.forEach(piece => {
        expect(piece.name).toBeDefined()
        expect(piece.symbol).toBeDefined()
        expect(piece.position).toMatch(/^[a-h][1-8]$/)
      })
    })

    it('contient le roi blanc en e1', () => {
      const pieces = service.getAllPieces()
      const whiteKing = pieces.find(p => p.symbol === '♔')
      expect(whiteKing).toBeDefined()
      expect(whiteKing.position).toBe('e1')
      expect(whiteKing.name).toBe('Roi')
    })

    it('contient la dame noire en d8', () => {
      const pieces = service.getAllPieces()
      const blackQueen = pieces.find(p => p.symbol === '♛')
      expect(blackQueen).toBeDefined()
      expect(blackQueen.position).toBe('d8')
      expect(blackQueen.name).toBe('Dame')
    })
  })

  describe('movePiece', () => {
    it('déplace une pièce vers une case vide', () => {
      const result = service.movePiece(6, 4, 4, 4) // e2 -> e4
      expect(result).toBe(true)
      expect(service.getPieceAt(6, 4)).toBeNull()
      expect(service.getPieceAt(4, 4).symbol).toBe('♙')
    })

    it('retourne false si la case source est vide', () => {
      const result = service.movePiece(4, 4, 3, 4)
      expect(result).toBe(false)
    })

    it('permet de capturer une pièce adverse', () => {
      // Déplacer le pion blanc e2 directement sur le pion noir e7
      service.movePiece(6, 4, 1, 4)
      expect(service.getPieceAt(1, 4).symbol).toBe('♙')
      expect(service.getPieceAt(1, 4).color).toBe('white')
    })

    it('permet de déplacer sur une case occupée par une pièce de même couleur', () => {
      // Pion blanc e2 sur cavalier blanc g1 (pas de règle appliquée)
      const result = service.movePiece(6, 4, 7, 6)
      expect(result).toBe(true)
      expect(service.getPieceAt(7, 6).symbol).toBe('♙')
    })

    it('met à jour le nombre de pièces après une capture', () => {
      expect(service.getAllPieces()).toHaveLength(32)
      service.movePiece(6, 4, 1, 4) // blanc capture noir
      expect(service.getAllPieces()).toHaveLength(31)
    })
  })

  describe('getHistory', () => {
    it("l'historique est vide au départ", () => {
      expect(service.getHistory()).toHaveLength(0)
    })

    it('enregistre un déplacement simple', () => {
      service.movePiece(6, 4, 4, 4) // e2 -> e4
      const history = service.getHistory()
      expect(history).toHaveLength(1)
      expect(history[0].moveNumber).toBe(1)
      expect(history[0].piece.symbol).toBe('♙')
      expect(history[0].piece.name).toBe('Pion')
      expect(history[0].from).toBe('e2')
      expect(history[0].to).toBe('e4')
      expect(history[0].captured).toBeNull()
    })

    it('enregistre une capture', () => {
      service.movePiece(6, 4, 1, 4) // pion blanc e2 capture pion noir e7
      const history = service.getHistory()
      expect(history).toHaveLength(1)
      expect(history[0].captured).not.toBeNull()
      expect(history[0].captured.symbol).toBe('♟')
      expect(history[0].captured.name).toBe('Pion')
    })

    it('enregistre plusieurs coups consécutifs', () => {
      service.movePiece(6, 4, 4, 4) // e2 -> e4
      service.movePiece(1, 4, 3, 4) // e7 -> e5
      service.movePiece(7, 5, 4, 2) // Fou f1 -> c4
      const history = service.getHistory()
      expect(history).toHaveLength(3)
      expect(history[0].moveNumber).toBe(1)
      expect(history[1].moveNumber).toBe(2)
      expect(history[2].moveNumber).toBe(3)
      expect(history[2].piece.name).toBe('Fou')
      expect(history[2].from).toBe('f1')
      expect(history[2].to).toBe('c4')
    })

    it("un déplacement raté n'est pas enregistré dans l'historique", () => {
      service.movePiece(4, 4, 3, 4) // case vide, échoue
      expect(service.getHistory()).toHaveLength(0)
    })
  })
})
