'use client'

interface RatingScaleProps {
  value: number;
  onChange: (value: number) => void;
  question: string;
}

export default function RatingScale({ value, onChange, question }: RatingScaleProps) {
  return (
    <div className="space-y-8">
      <h3 className="text-xl md:text-2xl font-bold text-gray-900 text-center leading-relaxed">
        {question}
      </h3>
      
      <div className="space-y-6">
        <div className="flex justify-center space-x-4 md:space-x-6">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              onClick={() => onChange(rating)}
              className={`w-16 h-16 md:w-20 md:h-20 rounded-full flex items-center justify-center font-bold text-xl md:text-2xl transition-all duration-200 shadow-md ${
                value === rating
                  ? 'bg-orange-400 text-white shadow-xl scale-110 border-2 border-orange-500'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200 hover:scale-105 border-2 border-gray-200'
              }`}
            >
              {rating}
            </button>
          ))}
        </div>
        
        <div className="flex justify-center space-x-4 md:space-x-6">
          <div className="w-16 md:w-20 flex justify-center">
            <span className="text-sm md:text-base font-semibold text-gray-500">น้อยที่สุด</span>
          </div>
          <div className="w-16 md:w-20"></div>
          <div className="w-16 md:w-20"></div>
          <div className="w-16 md:w-20"></div>
          <div className="w-16 md:w-20 flex justify-center">
            <span className="text-sm md:text-base font-semibold text-gray-500">มากที่สุด</span>
          </div>
        </div>
      </div>
    </div>
  );
}