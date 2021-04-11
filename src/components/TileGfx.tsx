import './TileGfx.scss';

export interface TileGfxProps {
    type: 'ground' | 'destination';
}

const TileGfx: React.FC<TileGfxProps> = ({ type }) => {
    return (
        <div className={'tile tile--' + type}>
            {type === 'destination' && <div className="tile__inner-square"></div>}
        </div>
    );
};

export default TileGfx;
