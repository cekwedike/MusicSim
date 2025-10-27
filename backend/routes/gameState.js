const express = require('express');
const router = express.Router();
const { GameSave, User } = require('../models');
const authMiddleware = require('../middleware/auth');
const { Op } = require('sequelize');

// All routes require authentication
router.use(authMiddleware);

/**
 * @swagger
 * /api/game/save:
 *   post:
 *     summary: Save game state
 *     description: Save current game state to a slot
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               slotName:
 *                 type: string
 *               gameState:
 *                 $ref: '#/components/schemas/GameState'
 *     responses:
 *       200:
 *         description: Game saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */

/**
 * @route   POST /api/game/save
 * @desc    Save game state to database
 * @access  Private
 */
router.post('/save', async (req, res, next) => {
  try {
    const { slotName, gameState } = req.body;

    // Validate input
    if (!gameState) {
      return res.status(400).json({
        success: false,
        message: 'Game state is required'
      });
    }

    // Validate game state structure
    if (!gameState.artistName || !gameState.playerStats || !gameState.date) {
      return res.status(400).json({
        success: false,
        message: 'Invalid game state structure. Required: artistName, playerStats, date'
      });
    }

    // Validate player stats structure
    if (!gameState.playerStats.cash && gameState.playerStats.cash !== 0) {
      return res.status(400).json({
        success: false,
        message: 'Invalid player stats structure'
      });
    }

    // Calculate weeks played from game date
    const weeksPlayed = (gameState.date.year - 1) * 48 + 
                       (gameState.date.month - 1) * 4 + 
                       gameState.date.week;

    // Validate slot name
    const finalSlotName = slotName || 'auto';
    if (finalSlotName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Slot name must be 50 characters or less'
      });
    }

    // Check if save slot already exists for this user
    let save = await GameSave.findOne({
      where: {
        userId: req.userId,
        slotName: finalSlotName
      }
    });

    if (save) {
      // Update existing save
      save.artistName = gameState.artistName;
      save.genre = gameState.artistGenre || 'Unknown';
      save.gameState = gameState;
      save.difficulty = gameState.difficulty || 'realistic';
      save.weeksPlayed = weeksPlayed;
      save.isActive = true;
      save.lastPlayedAt = new Date();
      await save.save();
    } else {
      // Create new save
      save = await GameSave.create({
        userId: req.userId,
        slotName: finalSlotName,
        artistName: gameState.artistName,
        genre: gameState.artistGenre || 'Unknown',
        gameState: gameState,
        difficulty: gameState.difficulty || 'realistic',
        weeksPlayed: weeksPlayed,
        isActive: true,
        lastPlayedAt: new Date()
      });
    }

    res.json({
      success: true,
      message: 'Game saved successfully',
      data: {
        saveId: save.id,
        slotName: save.slotName,
        artistName: save.artistName,
        genre: save.genre,
        difficulty: save.difficulty,
        weeksPlayed: save.weeksPlayed,
        savedAt: save.updatedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/load/{slotName}:
 *   get:
 *     summary: Load specific save slot
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: slotName
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Save loaded
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Save not found
 */
router.get('/load/:slotName', async (req, res, next) => {
  try {
    const { slotName } = req.params;

    const save = await GameSave.findOne({
      where: {
        userId: req.userId,
        slotName: slotName,
        isActive: true
      },
      order: [['updatedAt', 'DESC']]
    });

    if (!save) {
      return res.status(404).json({
        success: false,
        message: 'Save not found'
      });
    }

    res.json({
      success: true,
      data: {
        saveId: save.id,
        slotName: save.slotName,
        gameState: save.gameState,
        artistName: save.artistName,
        genre: save.genre,
        difficulty: save.difficulty,
        weeksPlayed: save.weeksPlayed,
        savedAt: save.updatedAt,
        createdAt: save.createdAt,
        lastPlayedAt: save.lastPlayedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/load/id/{saveId}:
 *   get:
 *     summary: Load save by ID
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saveId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Save loaded by id
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 *       404:
 *         description: Save not found
 */
router.get('/load/id/:saveId', async (req, res, next) => {
  try {
    const { saveId } = req.params;

    const save = await GameSave.findOne({
      where: {
        id: saveId,
        userId: req.userId,
        isActive: true
      }
    });

    if (!save) {
      return res.status(404).json({
        success: false,
        message: 'Save not found'
      });
    }

    res.json({
      success: true,
      data: {
        saveId: save.id,
        slotName: save.slotName,
        gameState: save.gameState,
        artistName: save.artistName,
        genre: save.genre,
        difficulty: save.difficulty,
        weeksPlayed: save.weeksPlayed,
        savedAt: save.updatedAt,
        createdAt: save.createdAt,
        lastPlayedAt: save.lastPlayedAt
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/saves:
 *   get:
 *     summary: List all saves for current user
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: List of saves
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ApiResponse'
 */
router.get('/saves', async (req, res, next) => {
  try {
    const { limit = 20, offset = 0 } = req.query;

    const saves = await GameSave.findAll({
      where: {
        userId: req.userId,
        isActive: true
      },
      attributes: [
        'id',
        'slotName',
        'artistName',
        'genre',
        'difficulty',
        'weeksPlayed',
        'createdAt',
        'updatedAt',
        'lastPlayedAt'
      ],
      order: [['updatedAt', 'DESC']],
      limit: parseInt(limit),
      offset: parseInt(offset)
    });

    const totalCount = await GameSave.count({
      where: {
        userId: req.userId,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: {
        saves,
        pagination: {
          total: totalCount,
          limit: parseInt(limit),
          offset: parseInt(offset),
          hasMore: totalCount > (parseInt(offset) + parseInt(limit))
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/save/{saveId}:
 *   delete:
 *     summary: Delete a save (soft delete)
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: saveId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Save deleted
 *       404:
 *         description: Save not found
 */
router.delete('/save/:saveId', async (req, res, next) => {
  try {
    const { saveId } = req.params;

    const save = await GameSave.findOne({
      where: {
        id: saveId,
        userId: req.userId
      }
    });

    if (!save) {
      return res.status(404).json({
        success: false,
        message: 'Save not found'
      });
    }

    // Soft delete by marking as inactive
    save.isActive = false;
    await save.save();

    res.json({
      success: true,
      message: 'Save deleted successfully',
      data: {
        saveId: save.id,
        slotName: save.slotName
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/saves/all:
 *   delete:
 *     summary: Delete all saves for user (soft delete)
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: All saves deleted
 */
router.delete('/saves/all', async (req, res, next) => {
  try {
    const result = await GameSave.update(
      { isActive: false },
      {
        where: {
          userId: req.userId,
          isActive: true
        }
      }
    );

    res.json({
      success: true,
      message: `${result[0]} saves deleted successfully`,
      data: {
        deletedCount: result[0]
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/autosave:
 *   get:
 *     summary: Check if autosave exists
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Autosave state
 */
router.get('/autosave', async (req, res, next) => {
  try {
    const autosave = await GameSave.findOne({
      where: {
        userId: req.userId,
        slotName: 'auto',
        isActive: true
      },
      attributes: [
        'id',
        'artistName',
        'genre',
        'difficulty',
        'weeksPlayed',
        'updatedAt',
        'lastPlayedAt'
      ]
    });

    if (!autosave) {
      return res.json({
        success: true,
        data: {
          exists: false
        }
      });
    }

    res.json({
      success: true,
      data: {
        exists: true,
        autosave: {
          id: autosave.id,
          artistName: autosave.artistName,
          genre: autosave.genre,
          difficulty: autosave.difficulty,
          weeksPlayed: autosave.weeksPlayed,
          savedAt: autosave.updatedAt,
          lastPlayedAt: autosave.lastPlayedAt
        }
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/save/rename:
 *   post:
 *     summary: Rename a save slot
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               saveId:
 *                 type: string
 *               newSlotName:
 *                 type: string
 *     responses:
 *       200:
 *         description: Save renamed
 *       400:
 *         description: Invalid input
 */
router.post('/save/rename', async (req, res, next) => {
  try {
    const { saveId, newSlotName } = req.body;

    if (!saveId || !newSlotName) {
      return res.status(400).json({
        success: false,
        message: 'Save ID and new slot name are required'
      });
    }

    // Validate slot name
    if (newSlotName.length < 1 || newSlotName.length > 50) {
      return res.status(400).json({
        success: false,
        message: 'Slot name must be between 1 and 50 characters'
      });
    }

    // Cannot rename to 'auto' - reserved name
    if (newSlotName.toLowerCase() === 'auto') {
      return res.status(400).json({
        success: false,
        message: 'Cannot use "auto" as slot name - it is reserved'
      });
    }

    const save = await GameSave.findOne({
      where: {
        id: saveId,
        userId: req.userId,
        isActive: true
      }
    });

    if (!save) {
      return res.status(404).json({
        success: false,
        message: 'Save not found'
      });
    }

    // Check if new slot name already exists
    const existingSave = await GameSave.findOne({
      where: {
        userId: req.userId,
        slotName: newSlotName,
        isActive: true,
        id: { [Op.ne]: saveId }
      }
    });

    if (existingSave) {
      return res.status(400).json({
        success: false,
        message: 'A save with this name already exists'
      });
    }

    const oldSlotName = save.slotName;
    save.slotName = newSlotName;
    await save.save();

    res.json({
      success: true,
      message: 'Save renamed successfully',
      data: {
        saveId: save.id,
        oldSlotName,
        newSlotName: save.slotName
      }
    });
  } catch (error) {
    next(error);
  }
});

/**
 * @swagger
 * /api/game/saves/count:
 *   get:
 *     summary: Get count of saves by difficulty
 *     tags: [Game State]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Counts by difficulty
 */
router.get('/saves/count', async (req, res, next) => {
  try {
    const { sequelize } = require('../models');

    const counts = await GameSave.findAll({
      where: {
        userId: req.userId,
        isActive: true
      },
      attributes: [
        'difficulty',
        [sequelize.fn('COUNT', sequelize.col('id')), 'count']
      ],
      group: ['difficulty'],
      raw: true
    });

    const totalCount = await GameSave.count({
      where: {
        userId: req.userId,
        isActive: true
      }
    });

    res.json({
      success: true,
      data: {
        total: totalCount,
        byDifficulty: counts
      }
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;