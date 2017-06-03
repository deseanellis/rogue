import React from 'react';

const Help = (props) => {
  return(
    <div className={`help animated bounceInRight`}>
      <div className="game-controls">
        <ul>
          <li>Use your keyboard direction keys to move the player.</li>
          <li>Click on any enemy to see their stats.</li>
          <li>Save the Princess from "The Boss" and his Monsterous Gang of Monster Gangsters. He is on the fifth and final dungeon floor.</li>
        </ul>
      </div>
      <div className="legend">
        <div className="title">Legend</div>
        <div>

          <div className="units">

            <div className="unit-row">
              <div className="player"></div>
              <div className="description">
                Your hero.
              </div>
            </div>

            <div className="unit-row">
              <div className="princess"></div>
              <div className="description">
                The Princess.
              </div>
            </div>

            <div className="unit-row">
              <div className="enemy"></div>
              <div className="description">
                The Enemies.
              </div>
            </div>

            <div className="unit-row">
              <div className="health"></div>
              <div className="description">
                Health. Will not increase if bar is filled.
              </div>
            </div>

            <div className="unit-row">
              <div className="shield"></div>
              <div className="description">
                Shields. Increases your guard stats.
              </div>
            </div>


            <div className="unit-row">
              <div className="weapon"></div>
              <div className="description">
                Weapons. Increase your attack and guard stats.
              </div>
            </div>

            <div className="unit-row">
              <div className="ladder"></div>
              <div className="description">
                Ladder/Stairs. Descend your Hero deeper into the dungeon.
              </div>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}

export default Help;
