export default function PlayerList() {
  const players = [{name:"Rupesh"},{name:"Rakesh"},{name:"Rahul"}];
  return (
  <div className="flex flex-col bg-white w-40 gap-2 rounded-md">
    {players.map((player,index)=><div className="flex justify-evenly min-h-10 border-2 border-black/40 rounded-md" key={index}>
      <p>#{index}</p>
      <p>{player.name}</p>
    </div>)}
  </div>
  )}