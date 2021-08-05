import { MapFieldSign } from '../../models/MapTemplate';
import BoxGfx from './BoxGfx';
import ObstacleGfx from './ObstacleGfx';
import PlayerGfx from './PlayerGfx';
import TileGfx from './TileGfx';

export interface FieldGfxProps {
    sign: MapFieldSign;
}

const FieldGfx: React.FC<FieldGfxProps> = ({ sign }) => {
    if (sign === 'e') return <></>;
    if (sign === 'o') return <ObstacleGfx></ObstacleGfx>;
    if (sign === 'd') return <TileGfx type="destination"></TileGfx>;
    if (sign === 'b') return <BoxGfx></BoxGfx>;
    if (sign === 'p') return <PlayerGfx></PlayerGfx>;
    return <TileGfx type="ground"></TileGfx>;
};

export default FieldGfx;
