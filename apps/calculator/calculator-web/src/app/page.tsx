'use client';

import { useState } from 'react';
import { sum } from './utils/sum';
import { sub } from './utils/sub';
import { mul } from './utils/mul';
import { div } from './utils/div';

export default function Calculator() {
  const [display, setDisplay] = useState<string>('0');
  const [prevValue, setPrevValue] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [isNewInput, setIsNewInput] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const handleNumber = (value: string) => {
    setError(null);
    if (isNewInput) {
      setDisplay(value === '.' ? '0.' : value);
      setIsNewInput(false);
    } else {
      if (value === '.' && display.includes('.')) return;
      setDisplay((prev) => prev + value);
    }
  };

  const handleOperation = (op: string) => {
    setError(null);
    const current = parseFloat(display);

    if (prevValue !== null && operation && !isNewInput) {
      calculateResult();
    } else {
      setPrevValue(current);
    }

    setOperation(op);
    setIsNewInput(true);
  };

  const calculateResult = () => {
    if (prevValue === null || operation === null) return;

    const current = parseFloat(display);
    let result = 0;

    try {
      switch (operation) {
        case '+':
          result = sum(prevValue, current);
          break;
        case '-':
          result = sub(prevValue, current);
          break;
        case '*':
          result = mul(prevValue, current);
          break;
        case '/':
          result = div(prevValue, current);
          break;
        default:
          return;
      }

      setDisplay(String(result));
      setPrevValue(result);
      setOperation(null);
      setIsNewInput(true);
    } catch (err: unknown) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Алдаа гарлаа');
      }
      setDisplay('Error');
      setIsNewInput(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevValue(null);
    setOperation(null);
    setIsNewInput(true);
    setError(null);
  };

  return (
    <div className="calc-wrapper">
      <div className="calc-box">
        <div className="calc-display">
          <div className="calc-prev">
            {prevValue !== null && `${prevValue} ${operation || ''}`}
          </div>
          <div className="calc-current">{display}</div>
          {error && <div className="calc-error">{error}</div>}
        </div>

        <div className="calc-grid">
          <button onClick={handleClear} className="calc-btn btn-ac">
            AC
          </button>
          <button
            onClick={() => handleOperation('/')}
            className="calc-btn btn-op"
          >
            ÷
          </button>

          <button onClick={() => handleNumber('7')} className="calc-btn">
            7
          </button>
          <button onClick={() => handleNumber('8')} className="calc-btn">
            8
          </button>
          <button onClick={() => handleNumber('9')} className="calc-btn">
            9
          </button>
          <button
            onClick={() => handleOperation('*')}
            className="calc-btn btn-op"
          >
            ×
          </button>

          <button onClick={() => handleNumber('4')} className="calc-btn">
            4
          </button>
          <button onClick={() => handleNumber('5')} className="calc-btn">
            5
          </button>
          <button onClick={() => handleNumber('6')} className="calc-btn">
            6
          </button>
          <button
            onClick={() => handleOperation('-')}
            className="calc-btn btn-op"
          >
            -
          </button>

          <button onClick={() => handleNumber('1')} className="calc-btn">
            1
          </button>
          <button onClick={() => handleNumber('2')} className="calc-btn">
            2
          </button>
          <button onClick={() => handleNumber('3')} className="calc-btn">
            3
          </button>
          <button
            onClick={() => handleOperation('+')}
            className="calc-btn btn-op"
          >
            +
          </button>

          <button
            onClick={() => handleNumber('0')}
            className="calc-btn btn-zero"
          >
            0
          </button>
          <button onClick={() => handleNumber('.')} className="calc-btn">
            .
          </button>
          <button onClick={calculateResult} className="calc-btn btn-equal">
            =
          </button>
        </div>
      </div>
    </div>
  );
}
