import { FC } from 'react';
import AudioScale from './components/AudioScale';

const App: FC = () => {
  return (
    <div className={'wrapper'}>
      <div className={'max'}>
        <AudioScale />
      </div>
    </div>
  );
};

export default App;
