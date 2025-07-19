'use client'

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  question: string;
}

export default function RatingScale({ value, onChange, question }: RatingScaleProps) {
  return (
    <div className="space-y-6">
      <h3 className="text-lg font-light text-gray-900 text-center leading-relaxed">
        {question}
      </h3>
      
      <div className="space-y-4">
        <div className="flex justify-center space-x-3">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`w-14 h-14 rounded-full flex items-center justify-center font-light text-lg transition-all duration-200 ${
                value === rating
                  ? 'bg-orange-400 text-white shadow-lg scale-110'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:scale-105'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center space-x-3">
          <div className="w-14 flex justify-center">
            <span className="text-xs text-gray-400">น้อยที่สุด</span>
          </div>
          <div className="w-14"></div>
          <div className="w-14"></div>
          <div className="w-14"></div>
          <div className="w-14 flex justify-center">
            <span className="text-xs text-gray-400">มากที่สุด</span>
          </div>
        </div>
      </div>
    </div>
  );
}