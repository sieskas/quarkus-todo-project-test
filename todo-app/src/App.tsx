import {TodoPage} from "./pages/TodoPage.tsx";
import { TodoProvider } from './contexts/TodoContext';
import { NotificationProvider } from './contexts/NotificationContext';
import { NotificationContainer } from './components/ui/NotificationContainer';


function App() {
    return (
        <NotificationProvider>
            <TodoProvider>
                <div className="min-h-screen bg-gray-50">
                    <TodoPage />
                    <NotificationContainer />
                </div>
            </TodoProvider>
        </NotificationProvider>
    );
}

export default App;