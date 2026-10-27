import React, { useState } from 'react';
import { Delete, Divide, Equal, Minus, Plus, X } from 'lucide-react';

export const CalculatorApp: React.FC = () => {
  const [display, setDisplay] = useState('0');
  const [prevVal, setPrevVal] = useState<number | null>(null);
  const [operation, setOperation] = useState<string | null>(null);
  const [overwrite, setOverwrite] = useState(false);

  const handleDigit = (digit: string) => {
    if (display === '0' || overwrite) {
      setDisplay(digit);
      setOverwrite(false);
    } else {
      setDisplay(display + digit);
    }
  };

  const handleOperator = (op: string) => {
    const current = parseFloat(display);
    if (prevVal === null) {
      setPrevVal(current);
    } else if (operation) {
      const result = compute(prevVal, current, operation);
      setPrevVal(result);
      setDisplay(String(result));
    }
    setOperation(op);
    setOverwrite(true);
  };

  const compute = (a: number, b: number, op: string): number => {
    switch (op) {
      case '+': return a + b;
      case '-': return a - b;
      case '×': return a * b;
      case '÷': return b !== 0 ? a / b : 0;
      default: return b;
    }
  };

  const handleEqual = () => {
    if (prevVal !== null && operation) {
      const current = parseFloat(display);
      const result = compute(prevVal, current, operation);
      setDisplay(String(result));
      setPrevVal(null);
      setOperation(null);
      setOverwrite(true);
    }
  };

  const handleClear = () => {
    setDisplay('0');
    setPrevVal(null);
    setOperation(null);
    setOverwrite(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#202024] p-3 text-white select-none">
      <div className="text-right py-4 px-2">
        <div className="text-xs text-zinc-400 h-4">
          {prevVal !== null && operation ? `${prevVal} ${operation}` : ''}
        </div>
        <div className="text-3xl font-semibold tracking-tight truncate">{display}</div>
      </div>

      <div className="grid grid-cols-4 gap-1.5 flex-1 mt-2 text-sm font-medium">
        <button onClick={handleClear} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3">C</button>
        <button onClick={handleBackspace} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3 flex items-center justify-center">
          <Delete size={16} />
        </button>
        <button onClick={() => handleOperator('÷')} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3 flex items-center justify-center">
          <Divide size={16} />
        </button>
        <button onClick={() => handleOperator('×')} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3 flex items-center justify-center">
          <X size={16} />
        </button>

        {['7', '8', '9'].map((d) => (
          <button key={d} onClick={() => handleDigit(d)} className="bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.04] rounded py-3 text-base font-semibold">{d}</button>
        ))}
        <button onClick={() => handleOperator('-')} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3 flex items-center justify-center">
          <Minus size={16} />
        </button>

        {['4', '5', '6'].map((d) => (
          <button key={d} onClick={() => handleDigit(d)} className="bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.04] rounded py-3 text-base font-semibold">{d}</button>
        ))}
        <button onClick={() => handleOperator('+')} className="bg-white/[0.04] hover:bg-white/[0.08] active:bg-white/[0.02] rounded py-3 flex items-center justify-center">
          <Plus size={16} />
        </button>

        {['1', '2', '3'].map((d) => (
          <button key={d} onClick={() => handleDigit(d)} className="bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.04] rounded py-3 text-base font-semibold">{d}</button>
        ))}
        <button onClick={handleEqual} className="bg-sky-600 hover:bg-sky-500 active:bg-sky-700 rounded py-3 row-span-2 flex items-center justify-center text-white">
          <Equal size={18} />
        </button>

        <button onClick={() => handleDigit('0')} className="col-span-2 bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.04] rounded py-3 text-base font-semibold">0</button>
        <button onClick={() => !display.includes('.') && setDisplay(display + '.')} className="bg-white/[0.07] hover:bg-white/[0.12] active:bg-white/[0.04] rounded py-3 text-base font-semibold">.</button>
      </div>
    </div>
  );
};
