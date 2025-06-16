#!/usr/bin/env node

import TaskMasterMCPServer from './src/index.js';
import dotenv from 'dotenv';
import logger from './src/logger.js';
import express from 'express';
import * as configManager from '../scripts/modules/config-manager.js';

// Load environment variables
dotenv.config();

// Parse command line arguments
const args = process.argv.slice(2);
const portArg = args.find(arg => arg.startsWith('--port='));
const HEALTH_CHECK_PORT = portArg ? parseInt(portArg.split('=')[1]) : (process.env.HEALTH_CHECK_PORT || 8001);

/**
 * Start the MCP server and a separate health check API
 */
async function startServer() {
	const server = new TaskMasterMCPServer();
	const app = express();

	// Simple health check endpoint
	app.get('/health', async (req, res) => {
		try {
			// Inicializa o servidor MCP se ainda não estiver inicializado
			if (!server.initialized) {
				await server.init();
			}

			// Obtém informações do MCP
			const mcpInfo = {
				name: server.options.name,
				version: server.options.version,
				resources: server.server.resources || [],
				tools: server.server.tools || []
			};

			res.json({
				status: 'healthy',
				timestamp: new Date().toISOString(),
				serverTime: new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' }),
				mcp: mcpInfo
			});
		} catch (error) {
			logger.error(`Error on health check endpoint: ${error.message}`);
			res.status(500).json({
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				error: error.message
			});
		}
	});

	// Health check API endpoint
	app.get('/health/config', async (req, res) => {
		try {
			const currentConfig = configManager.getConfig(null, true); // Force reload to get latest
			const availableModels = configManager.getAvailableModels();
			const allProviders = configManager.getAllProviders();

			const apiKeyStatuses = {};
			for (const provider of allProviders) {
				apiKeyStatuses[provider] = configManager.isApiKeySet(provider, null, configManager.findProjectRoot());
			}

			res.json({
				status: 'healthy',
				timestamp: new Date().toISOString(),
				configuration: currentConfig,
				availableModels: availableModels,
				apiKeyStatuses: apiKeyStatuses,
				mcpServerPort: HEALTH_CHECK_PORT // This indicates the health check port
			});
		} catch (error) {
			logger.error(`Error on health check endpoint: ${error.message}`);
			res.status(500).json({
				status: 'unhealthy',
				timestamp: new Date().toISOString(),
				error: error.message
			});
		}
	});

	// Start the Express health check server
	app.listen(HEALTH_CHECK_PORT, () => {
		logger.info(`Health check API listening on port ${HEALTH_CHECK_PORT}`);
	});

	// Handle graceful shutdown for MCP server
	process.on('SIGINT', async () => {
		await server.stop();
		process.exit(0);
	});

	process.on('SIGTERM', async () => {
		await server.stop();
		process.exit(0);
	});

	try {
		await server.start();
	} catch (error) {
		logger.error(`Failed to start MCP server: ${error.message}`);
		process.exit(1);
	}
}

// Start the server
startServer();
