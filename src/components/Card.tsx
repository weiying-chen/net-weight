import { Reading } from "../types";

const CardHeader: React.FC<{ item: string }> = ({ item }) => {
  return (
    <>
      <img
        src="https://via.placeholder.com/600x300"
        alt="Placeholder Image"
        className="w-full h-auto rounded-t-3xl"
      />
      <div className="py-6">
        <h2 className="font-semibold tracking-tight text-4xl text-center">
          {item}
        </h2>
      </div>
    </>
  );
};

const CardContent: React.FC<{ reading: Reading; isFirstReading?: boolean }> = ({
  reading,
  isFirstReading,
}) => {
  return (
    <div className="px-4 space-y-2">
      <h3
        className={
          isFirstReading ? "text-2xl font-semibold" : "text-sm font-semibold"
        }
      >
        Weight: {reading.weight.toFixed(2)} g
      </h3>
      <p className={`text-gray-400 ${isFirstReading ? "text-md" : "text-xs"}`}>
        {new Date(reading.createdAt).toLocaleString()}
      </p>
    </div>
  );
};

type CardProps = {
  item: string;
  readings: Reading[];
};

const Card: React.FC<CardProps> = ({ item, readings }) => {
  return (
    <div className="bg-white border-[#083355] border-[1.5px] rounded-3xl [box-shadow:4px_4px_0px_rgba(0,0,0,0.1)] w-full max-w-2xl mb-6">
      <CardHeader item={item} />
      <div>
        {readings.length > 0 && (
          <>
            <CardContent reading={readings[0]} isFirstReading />
            {readings.slice(1).map((reading) => (
              <div key={reading.id}>
                <hr className="my-4 border-gray-300" />
                <CardContent reading={reading} />
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default Card;
