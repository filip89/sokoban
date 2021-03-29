import './BlockGfx.scss';

export interface BlockGfxProps {
    type: 'player' | 'box' | 'obstacle';
}

const BlockGfx: React.FC<BlockGfxProps> = ({ type }) => {
    return (
        <div className={'block block--' + type}>
            <div className="block__top"></div>
            <div className="block__bottom"></div>
        </div>
    );
};

export default BlockGfx;
