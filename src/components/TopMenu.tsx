import './TopMenu.scss';

export interface TopMenuProps {
    isEditMode: boolean;
    onToggleMode: () => void;
    onMapAdd: () => void;
}

const TopMenu: React.FC<TopMenuProps> = ({ isEditMode, onToggleMode, onMapAdd, children }) => {
    return (
        <div className="top-menu">
            <button className="top-menu__button" onClick={onToggleMode}>
                {isEditMode ? 'PLAY' : 'EDIT'}
            </button>
            <div className="top-menu__maps">{children}</div>
            {isEditMode && (
                <button className="top-menu__button" onClick={onMapAdd}>
                    ADD MAP
                </button>
            )}
        </div>
    );
};

export default TopMenu;
