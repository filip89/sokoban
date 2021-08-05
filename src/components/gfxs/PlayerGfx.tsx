import './PlayerGfx.scss';

export interface PlayerGfxProps {}

const PlayerGfx: React.FC<PlayerGfxProps> = () => {
    return (
        <div className={'block block--player'}>
            <div className="block__top">
                <div className="block__player-sign">P</div>
            </div>
            <div className="block__bottom"></div>
        </div>
    );
};

export default PlayerGfx;
