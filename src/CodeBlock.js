import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import 'highlight.js/styles/default.css';
import hljs from 'highlight.js/lib/core';
import javascript from 'highlight.js/lib/languages/javascript';

hljs.registerLanguage('javascript', javascript);

const CodeBlock = ({ blockIndex }) => {
    const { blockIndex: routeBlockIndex } = useParams();
    const [code, setCode] = useState('');
    const [role, setRole] = useState('');
    const [showSmiley, setShowSmiley] = useState(false);
    const ws = useRef(null);
    const currentBlockIndex = blockIndex !== undefined ? blockIndex : routeBlockIndex;

    useEffect(() => {
        ws.current = new WebSocket('ws://localhost:5000');

        ws.current.onopen = () => {
            console.log('Connected to WebSocket server');
            ws.current.send(JSON.stringify({ type: 'join', blockIndex: currentBlockIndex }));

        };

        ws.current.onclose = () => {
            console.log('Disconnected from WebSocket server');
        };

        ws.current.onmessage = (event) => {
            const message = JSON.parse(event.data);
            console.log('Received message:', message);

            if (message.type === 'code') {
                console.log('Received code:', message.code);
                console.log('Received role:', message.role);
                setCode(message.code);
                setRole(message.role);
                if (message.role === 'mentor') {
                    hljs.highlightAll();
                }
            }

            if (message.type === 'codeUpdate') {
                console.log('Received code update:', message.code);
                setCode(message.code);
                if (role === 'mentor') {
                    hljs.highlightAll();
                }
            }
            if (message.type === 'solutionMatched') {
                setShowSmiley(true);
            }
        };

        return () => {
            if (ws.current) {
                ws.current.close();
                console.log('WebSocket closed');
            }
        };
    }, [currentBlockIndex]);

    useEffect(() => {
        console.log('Current role:', role);
        if (role === 'mentor') {
            hljs.highlightAll();
        }
    }, [role]);

    const handleCodeChange = (event) => {
        const newCode = event.target.value;
        setCode(newCode);
        ws.current.send(JSON.stringify({ type: 'codeUpdate', blockIndex: currentBlockIndex, code: newCode }));
    };

    return (
        <div>
            <h1>Code Block {currentBlockIndex}</h1>
            {role === 'student' ? (
                <textarea
                    style={{ width: '100%', height: '300px', display: 'block' }}
                    value={code}
                    onChange={handleCodeChange}
                />
            ) : role === 'mentor' ? (
                <pre style={{ width: '100%', height: '300px', border: '1px solid #ccc', padding: '10px' }}>
                    <code className="javascript hljs language-javascript">{code}</code>
                </pre>
            ) : (
                <p>Waiting for role assignment...</p>
            )}
            {showSmiley && <div className="smiley">😊</div>}
            <p>Role: {role}</p>
        </div>
    );
};

export default CodeBlock;
