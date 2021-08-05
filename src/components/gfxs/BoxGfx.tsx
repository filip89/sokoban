import './BoxGfx.scss';

export interface BoxGfxProps {}

const BoxGfx: React.FC<BoxGfxProps> = () => {
    return (
        <div className="block block--box">
            <div className="block__top">
                <div className="block__box-cut"></div>
            </div>
            <div className="block__bottom"></div>
        </div>
    );
};

export default BoxGfx;
