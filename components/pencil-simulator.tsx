'use client';

import { useState, useRef } from 'react';
import { Pencil } from '@/lib/pencil';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Separator } from '@/components/ui/separator';
import { PenTool, RotateCcw, Eraser, Edit3, Trash2 } from 'lucide-react';

export default function PencilSimulator() {
  const [pencil] = useState(() => new Pencil(100, 10, 50));
  const [writingText, setWritingText] = useState('');
  const [paperContent, setPaperContent] = useState('');
  const [eraseText, setEraseText] = useState('');
  const [editText, setEditText] = useState('');
  const [editPosition, setEditPosition] = useState(0);
  const [forceUpdate, setForceUpdate] = useState(0);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const triggerUpdate = () => setForceUpdate(prev => prev + 1);

  const handleWrite = () => {
    if (!writingText.trim()) return;
    
    const newContent = pencil.write(writingText);
    setPaperContent(prev => prev + newContent);
    setWritingText('');
    triggerUpdate();
  };

  const handleSharpen = () => {
    pencil.sharpen();
    triggerUpdate();
  };

  const handleErase = () => {
    if (!eraseText.trim()) return;
    
    const newContent = pencil.erase(paperContent, eraseText);
    setPaperContent(newContent);
    setEraseText('');
    triggerUpdate();
  };

  const handleEdit = () => {
    if (!editText.trim()) return;
    
    const newContent = pencil.edit(paperContent, editText, editPosition);
    setPaperContent(newContent);
    setEditText('');
    triggerUpdate();
  };

  const handleReset = () => {
    pencil.reset();
    setPaperContent('');
    setWritingText('');
    setEraseText('');
    setEditText('');
    setEditPosition(0);
    triggerUpdate();
  };

  const handleClearPaper = () => {
    setPaperContent('');
  };

  const getDurabilityColor = (value: number, max: number) => {
    const percentage = (value / max) * 100;
    if (percentage > 60) return 'bg-green-500';
    if (percentage > 30) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  const getPencilStatus = () => {
    if (!pencil.isSharp) return 'Dull - needs sharpening';
    if (pencil.pointDurability < 20) return 'Getting dull';
    return 'Sharp and ready';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 p-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-amber-900 mb-2 flex items-center justify-center gap-3">
            <PenTool className="w-8 h-8" />
            Pencil Durability Simulator
          </h1>
          <p className="text-amber-700 text-lg">
            Experience the realistic simulation of pencil wear through TDD principles
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Pencil Status Panel */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-900">
                <PenTool className="w-5 h-5" />
                Pencil Status
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center p-4 bg-amber-50 rounded-lg">
                <div className="text-3xl font-bold text-amber-900 mb-1">
                  {getPencilStatus()}
                </div>
                <div className="text-sm text-amber-700">
                  Length: {pencil.length} inches
                </div>
              </div>

              <div className="space-y-3">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-sm font-medium">Point Durability</Label>
                    <span className="text-sm text-gray-600">{pencil.pointDurability}/100</span>
                  </div>
                  <Progress 
                    value={pencil.pointDurability} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-sm font-medium">Eraser Durability</Label>
                    <span className="text-sm text-gray-600">{pencil.eraserDurability}/50</span>
                  </div>
                  <Progress 
                    value={(pencil.eraserDurability / 50) * 100} 
                    className="h-2"
                  />
                </div>

                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-sm font-medium">Pencil Length</Label>
                    <span className="text-sm text-gray-600">{pencil.length}/10</span>
                  </div>
                  <Progress 
                    value={(pencil.length / 10) * 100} 
                    className="h-2"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2">
                <Button 
                  onClick={handleSharpen}
                  disabled={!pencil.canSharpen}
                  className="bg-amber-600 hover:bg-amber-700"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Sharpen
                </Button>
                <Button 
                  onClick={handleReset}
                  variant="outline"
                  className="border-amber-600 text-amber-600 hover:bg-amber-50"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Reset
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Writing Paper */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="flex items-center justify-between text-amber-900">
                <span className="flex items-center gap-2">
                  <Edit3 className="w-5 h-5" />
                  Writing Paper
                </span>
                <Button 
                  onClick={handleClearPaper}
                  variant="outline"
                  size="sm"
                  className="text-red-600 border-red-600 hover:bg-red-50"
                >
                  <Trash2 className="w-4 h-4 mr-1" />
                  Clear
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="min-h-[300px] p-4 bg-blue-50 rounded-lg border-2 border-blue-200 relative">
                <div className="absolute inset-0 bg-blue-100 opacity-20 rounded-lg"></div>
                <textarea
                  ref={textareaRef}
                  value={paperContent}
                  onChange={(e) => setPaperContent(e.target.value)}
                  placeholder="Your writing will appear here..."
                  className="w-full h-full min-h-[250px] bg-transparent border-none outline-none resize-none font-mono text-gray-800 relative z-10"
                  style={{ lineHeight: '1.5' }}
                />
              </div>
              <div className="mt-2 text-sm text-gray-600">
                Characters: {paperContent.length} | Words: {paperContent.split(/\s+/).filter(w => w.length > 0).length}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Action Panels */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Write Panel */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-green-700 flex items-center gap-2">
                <PenTool className="w-4 h-4" />
                Write
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="writeText" className="text-sm font-medium">
                  Text to Write
                </Label>
                <Input
                  id="writeText"
                  value={writingText}
                  onChange={(e) => setWritingText(e.target.value)}
                  placeholder="Enter text to write..."
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleWrite}
                disabled={!pencil.isSharp || !writingText.trim()}
                className="w-full bg-green-600 hover:bg-green-700"
              >
                Write Text
              </Button>
              <div className="text-xs text-gray-600">
                Uppercase: -2 durability<br />
                Lowercase: -1 durability<br />
                Spaces/symbols: no cost
              </div>
            </CardContent>
          </Card>

          {/* Erase Panel */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-red-700 flex items-center gap-2">
                <Eraser className="w-4 h-4" />
                Erase
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="eraseText" className="text-sm font-medium">
                  Text to Erase
                </Label>
                <Input
                  id="eraseText"
                  value={eraseText}
                  onChange={(e) => setEraseText(e.target.value)}
                  placeholder="Enter text to erase..."
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleErase}
                disabled={!pencil.canErase || !eraseText.trim()}
                className="w-full bg-red-600 hover:bg-red-700"
              >
                Erase Text
              </Button>
              <div className="text-xs text-gray-600">
                Erases from right to left<br />
                Each character costs 1 durability<br />
                Finds last occurrence
              </div>
            </CardContent>
          </Card>

          {/* Edit Panel */}
          <Card className="bg-white/80 backdrop-blur-sm shadow-xl">
            <CardHeader>
              <CardTitle className="text-blue-700 flex items-center gap-2">
                <Edit3 className="w-4 h-4" />
                Edit
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <Label htmlFor="editText" className="text-sm font-medium">
                  Replacement Text
                </Label>
                <Input
                  id="editText"
                  value={editText}
                  onChange={(e) => setEditText(e.target.value)}
                  placeholder="Enter replacement text..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="editPosition" className="text-sm font-medium">
                  Position
                </Label>
                <Input
                  id="editPosition"
                  type="number"
                  value={editPosition}
                  onChange={(e) => setEditPosition(Number(e.target.value))}
                  placeholder="0"
                  min="0"
                  max={paperContent.length}
                  className="mt-1"
                />
              </div>
              <Button 
                onClick={handleEdit}
                disabled={!pencil.isSharp || !editText.trim()}
                className="w-full bg-blue-600 hover:bg-blue-700"
              >
                Edit Text
              </Button>
              <div className="text-xs text-gray-600">
                Write in spaces: normal cost<br />
                Write over text: creates '@' collision<br />
                Position starts at 0
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}