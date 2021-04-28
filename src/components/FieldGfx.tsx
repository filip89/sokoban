import { MapFieldSign } from '../models/MapTemplate';
import BlockGfx from './BlockGfx';
import TileGfx from './TileGfx';

export interface FieldGfxProps {
    sign: MapFieldSign;
}

const FieldGfx: React.FC<FieldGfxProps> = ({ sign }) => {
    if (sign === 'e') return <></>;
    if (sign === 'o') return <BlockGfx type="obstacle"></BlockGfx>;
    if (sign === 'd') return <TileGfx type="destination"></TileGfx>;
    if (sign === 'b') return <BlockGfx type="box"></BlockGfx>;
    if (sign === 'p') return <BlockGfx type="player"></BlockGfx>;
    return <TileGfx type="ground"></TileGfx>;
};

export default FieldGfx;
