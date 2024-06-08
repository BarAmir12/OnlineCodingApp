import React from 'react';
import { useNavigate } from 'react-router-dom';
import './styles.css';

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


const Lobby = () => {
    const navigate = useNavigate();

    const handleEnterCodeBlock = (blockIndex) => {
        navigate(`/code/${blockIndex}`);
    };

    return (
        <div className="container">
            <h1>Choose Code Block</h1>
            {codeBlocks.map((block, index) => (
                <button key={index} onClick={() => handleEnterCodeBlock(index)}>
                    {block.title}
                </button>
            ))}
        </div>
    );
};

export default Lobby;
