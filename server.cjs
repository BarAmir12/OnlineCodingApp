const express = require('express');
const http = require('http');
const WebSocket = require('ws');
const cors = require('cors');

const app = express();
const server = http.createServer(app);
const wss = new WebSocket.Server({ server });

app.use(cors({
    origin: 'http://localhost:3000',
    methods: ['GET', 'POST']
}));

const codeBlocks = [
    {
        title: 'Async case',
        code: 'async function example() {\n  // code here\n}',
        solution: 'async function example() {\n  try {\n    const result = await someAsyncFunction();\n    console.log(result);\n  } catch (error) {\n    console.error(error);\n  }\n}'
    },
    {
        title: 'Promise case',
        code: 'function example() {\n  return new Promise((resolve, reject) => {\n    // code here\n  });\n}',
        solution: 'function example() {\n  return new Promise((resolve, reject) => {\n    setTimeout(() => {\n      resolve("Success!");\n    }, 1000);\n  });\n}'
    },
    {
        title: 'Event loop',
        code: 'function eventLoopExample() {\n  setTimeout(() => {\n    console.log("Hello!");\n  }, 1000);\n}',
        solution: 'function eventLoopExample() {\n  setTimeout(() => {\n    console.log("Hello!");\n  }, 1000);\n}'
    },
    {
        title: 'Closure example',
        code: 'function closureExample() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  };\n}',
        solution: 'function closureExample() {\n  let count = 0;\n  return function() {\n    count += 1;\n    return count;\n  };\n}'
    }
];

const roles = {};

wss.on('connection', (ws) => {
    console.log('New client connected');

    ws.on('message', (message) => {
        const data = JSON.parse(message);
        console.log('Received message:', data);

        if (data.type === 'join') {
            const blockIndex = data.blockIndex;

            if (blockIndex === null || blockIndex === undefined || !codeBlocks[blockIndex]) {
                console.log('Invalid block index:', blockIndex);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid block index' }));
                return;
            }

            const role = !roles[blockIndex] ? 'mentor' : 'student';
            roles[blockIndex] = role === 'mentor' ? true : roles[blockIndex];
            console.log(`Assigned role: ${role} to client`);

            ws.send(JSON.stringify({ type: 'code', code: codeBlocks[blockIndex].code, role }));
            console.log(`Emitted code and role to client`);
        }

        if (data.type === 'codeUpdate') {
            const { blockIndex, code } = data;
            if (blockIndex === null || blockIndex === undefined || !codeBlocks[blockIndex]) {
                console.log('Invalid block index:', blockIndex);
                ws.send(JSON.stringify({ type: 'error', message: 'Invalid block index' }));
                return;
            }

            codeBlocks[blockIndex].code = code;
            const isSolution = code.trim() === codeBlocks[blockIndex].solution.trim();
            wss.clients.forEach(client => {
                if (client !== ws && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'codeUpdate', code }));
                }
                if (isSolution && client.readyState === WebSocket.OPEN) {
                    client.send(JSON.stringify({ type: 'solutionMatched' }));
                }
            });
            console.log(`Emitted code update to block ${blockIndex}`);
        }
    });

    ws.on('close', () => {
        console.log('Client disconnected');
    });
});

server.listen(5000, () => {
    console.log('Server running on port 5000');
});
