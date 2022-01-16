import './ObstacleGfx.scss';

export interface ObstacleGfxProps {}

const ObstacleGfx: React.FC<ObstacleGfxProps> = () => {
    return (
        <div className='block block--obstacle'>
            <div className="block__top"></div>
            <div className="block__bottom"></div>
        </div>
    );
};

export default ObstacleGfx;
