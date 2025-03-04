import { useEffect, useRef, useCallback, useState } from "react";
import { WikiCard } from "./components/WikiCard";
import { Loader2 } from "lucide-react";
import { useWikiArticles } from "./hooks/useWikiArticles";

function App() {
    const [showAbout, setShowAbout] = useState(false);
    const { loading, fetchArticles, articles } = useWikiArticles();
    const observerTarget = useRef(null);

    const handleObserver = useCallback(
        (entries: IntersectionObserverEntry[]) => {
            const [target] = entries;
            if (target.isIntersecting && !loading) {
                fetchArticles();
            }
        },
        [loading, fetchArticles]
    );

    useEffect(() => {
        const observer = new IntersectionObserver(handleObserver, {
            threshold: 0.1,
            rootMargin: "100px",
        });

        if (observerTarget.current) {
            observer.observe(observerTarget.current);
        }

        return () => observer.disconnect();
    }, [handleObserver]);

    useEffect(() => {
        fetchArticles();
    }, []);

    return (
        <div className="h-screen w-full bg-black text-white overflow-y-scroll snap-y snap-mandatory hide-scroll">
            <div className="fixed top-4 left-4 z-50">
                <button
                    onClick={() => window.location.reload()}
                    className="text-2xl font-bold text-white drop-shadow-lg hover:opacity-80 transition-opacity"
                >
                    WikiTok
                </button>
            </div>
            <div className="fixed top-4 right-4 z-50 flex flex-col items-end gap-2">
                <button
                    onClick={() => setShowAbout(!showAbout)}
                    className="text-sm text-white/70 hover:text-white transition-colors"
                >
                    About
                </button>

            </div>
            {showAbout && (
                <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4">
                    <div className="bg-gray-900 z-[41] p-6 rounded-lg max-w-md relative">
                        <button 
                        className="absolute top-2 right-2 text-white/70 hover:text-white"
                        onClick={() => setShowAbout(false)}>
                            ✕
                        </button>
                        <h2 className="text-xl font-bold mb-4">About WikiTok</h2>
                        <p className="mb-4">
                         A TikTok-style interface for exploring random Wikipedia articles.
                        </p>
                    </div>
                </div>
            )}

            {articles.map((article) => (
                <WikiCard key={article.pageid} article={article} />
            ))}
            <div ref={observerTarget} className="h-10 -mt-1" />
            {loading && (
                <div className="h-screen w-full flex items-center justify-center gap-2">
                    <Loader2 className="h-6 w-6 animate-spin" />
                    <span>Loading...</span>
                </div>
            )}
        </div>
    );
}

export default App;