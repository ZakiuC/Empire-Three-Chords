import {
  useCallback,
  useEffect,
  useState,
  type CSSProperties,
} from 'react';
import { SegmentBar } from './components/SegmentBar';
import { ResultValue } from './components/ResultValue';
import {
  initialCategories,
  poolStorageKey,
  themePresets,
  themeStorageKey,
  timeOptions,
  timingStorageKey,
} from './lib/constants';
import {
  createMap,
  formatDuration,
  formatIndexToken,
  getResultMetrics,
  loadCategories,
  loadTiming,
} from './lib/utils';

export default function App() {
  const [categories, setCategories] = useState(() => loadCategories());
  const [results, setResults] = useState<Record<string, string>>(() =>
    createMap(loadCategories(), '-'),
  );
  const [renderKeys, setRenderKeys] = useState<Record<string, number>>(() =>
    createMap(loadCategories(), 0),
  );
  const [isAuto, setIsAuto] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [newItems, setNewItems] = useState<Record<string, string>>(() =>
    createMap(initialCategories, ''),
  );
  const [activeTheme, setActiveTheme] = useState<string>(() => {
    try {
      const stored = localStorage.getItem(themeStorageKey);
      return themePresets.some((theme) => theme.id === stored) ? stored! : 'paper';
    } catch {
      return 'paper';
    }
  });
  const [intervalVal, setIntervalVal] = useState<number | 'custom'>(
    () => loadTiming().intervalVal,
  );
  const [customMs, setCustomMs] = useState<number>(() => loadTiming().customMs);

  const activeThemePreset =
    themePresets.find((theme) => theme.id === activeTheme) || themePresets[0];
  const currentMs =
    intervalVal === 'custom' ? Math.max(300, customMs || 0) : intervalVal;
  const primaryCategory =
    categories.find((category) => category.id === 'key') || categories[0] || null;
  const secondaryCategories = categories.filter(
    (category) => !primaryCategory || category.id !== primaryCategory.id,
  );
  const primaryMetrics = primaryCategory
    ? getResultMetrics(primaryCategory, results[primaryCategory.id], 14)
    : { total: 0, currentIndex: 0, filled: 0, segmentCount: 14, label: '-- / --' };

  const generateRandom = useCallback(() => {
    const nextResults: Record<string, string> = {};
    const nextRenderKeys: Record<string, number> = {};

    categories.forEach((category) => {
      if (category.items.length === 0) {
        nextResults[category.id] = '-';
      } else {
        const randomIndex = Math.floor(Math.random() * category.items.length);
        nextResults[category.id] = category.items[randomIndex];
      }
      nextRenderKeys[category.id] = Math.random();
    });

    setResults(nextResults);
    setRenderKeys(nextRenderKeys);
  }, [categories]);

  useEffect(() => {
    generateRandom();
  }, [generateRandom]);

  useEffect(() => {
    document.body.setAttribute('data-theme', activeThemePreset.id);
    document.documentElement.style.colorScheme = activeThemePreset.scheme;
    try {
      localStorage.setItem(themeStorageKey, activeThemePreset.id);
    } catch {
      /* ignore */
    }
  }, [activeThemePreset]);

  useEffect(() => {
    try {
      localStorage.setItem(poolStorageKey, JSON.stringify(categories));
    } catch {
      /* ignore */
    }
  }, [categories]);

  useEffect(() => {
    try {
      localStorage.setItem(
        timingStorageKey,
        JSON.stringify({ intervalVal, customMs }),
      );
    } catch {
      /* ignore */
    }
  }, [intervalVal, customMs]);

  useEffect(() => {
    if (!isAuto) return;
    const timer = window.setInterval(() => {
      generateRandom();
    }, currentMs);
    return () => window.clearInterval(timer);
  }, [currentMs, generateRandom, isAuto]);

  useEffect(() => {
    if (!showSettings) return;
    const handleKeydown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setShowSettings(false);
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, [showSettings]);

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (showSettings) {
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.body.style.overflow = originalOverflow;
    };
  }, [showSettings]);

  const handleAddItem = (categoryId: string) => {
    const nextValue = (newItems[categoryId] || '').trim();
    if (!nextValue) return;

    setCategories((previousCategories) =>
      previousCategories.map((category) => {
        if (category.id === categoryId && !category.items.includes(nextValue)) {
          return { ...category, items: [...category.items, nextValue] };
        }
        return category;
      }),
    );

    setNewItems((previousItems) => ({ ...previousItems, [categoryId]: '' }));
  };

  const handleRemoveItem = (categoryId: string, targetItem: string) => {
    setCategories((previousCategories) =>
      previousCategories.map((category) => {
        if (category.id === categoryId) {
          return {
            ...category,
            items: category.items.filter((item) => item !== targetItem),
          };
        }
        return category;
      }),
    );
  };

  return (
    <>
      <div className="app-shell">
        <main className="stage reveal">
          <header className="brand">
            <h1 className="brand-title">Empire の Three Chords</h1>
            <p className="brand-cn">帝国の三和弦</p>
          </header>

          <section className="display-grid">
            {primaryCategory && (
              <article
                className="hero-panel reveal"
                style={{ animationDelay: '80ms' }}
              >
                <div className="hero-ordinal" aria-hidden="true">
                  {formatIndexToken(primaryMetrics.currentIndex)}
                </div>

                <div className="panel-head">
                  <span className="panel-label">Key</span>
                </div>

                <div className="hero-body">
                  <p className="hero-kicker">Primary Result</p>
                  <ResultValue
                    value={results[primaryCategory.id] ?? '-'}
                    renderKey={renderKeys[primaryCategory.id] ?? 0}
                    className="result-value-hero"
                    maxSize={116}
                    minSize={36}
                  />
                </div>

                <div className="hero-footer">
                  <div className="hero-caption">
                    <span>调性 / PRIMARY</span>
                    <span>
                      {formatIndexToken(primaryCategory.items.length)} ITEMS
                    </span>
                  </div>
                  <SegmentBar
                    filled={primaryMetrics.filled}
                    total={primaryMetrics.segmentCount}
                  />
                </div>
              </article>
            )}

            <div className="secondary-column">
              {secondaryCategories.map((category, index) => {
                const metric = getResultMetrics(category, results[category.id], 10);

                return (
                  <article
                    key={category.id}
                    className="metric-card reveal"
                    style={{ animationDelay: `${140 + index * 60}ms` }}
                  >
                    <div className="panel-head">
                      <span className="panel-label">{category.id}</span>
                    </div>

                    <div className="metric-body">
                      <p className="metric-copy">{category.name}</p>
                      <ResultValue
                        value={results[category.id] ?? '-'}
                        renderKey={renderKeys[category.id] ?? 0}
                        className="result-value-stat"
                        maxSize={60}
                        minSize={24}
                      />
                    </div>

                    <SegmentBar
                      filled={metric.filled}
                      total={metric.segmentCount}
                      compact
                    />
                  </article>
                );
              })}
            </div>
          </section>

          <section className="controls-strip">
            <button
              type="button"
              className={`cruise-button ${isAuto ? 'is-active' : ''}`}
              onClick={() => setIsAuto((previousState) => !previousState)}
              aria-pressed={isAuto}
            >
              <span className="toggle-track" aria-hidden="true">
                <span className="toggle-thumb" />
              </span>

              <span className="control-copy">
                <span className="button-label">Auto Cruise</span>
                <strong>{isAuto ? '自动巡航' : '待机'}</strong>
                <span>
                  {isAuto
                    ? `当前间隔 ${formatDuration(currentMs)}`
                    : `点击后按 ${formatDuration(currentMs)} 自动随机`}
                </span>
              </span>

              <span
                className={`signal-dot ${isAuto ? 'is-live' : ''}`}
                aria-hidden="true"
              />
            </button>

            <button
              type="button"
              className="manual-button"
              onClick={generateRandom}
            >
              <span className="button-label">Manual Random</span>
              <strong>手动随机</strong>
            </button>
          </section>
        </main>
      </div>

      <button
        type="button"
        className={`settings-entry ${showSettings ? 'is-hidden' : ''}`}
        onClick={() => setShowSettings(true)}
        aria-label="打开设置"
      >
        <span className="settings-entry-icon" aria-hidden="true">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <line x1="4" y1="6" x2="20" y2="6" />
            <circle cx="9" cy="6" r="2" />
            <line x1="4" y1="12" x2="20" y2="12" />
            <circle cx="15" cy="12" r="2" />
            <line x1="4" y1="18" x2="20" y2="18" />
            <circle cx="11" cy="18" r="2" />
          </svg>
        </span>
      </button>

      <div
        className={`drawer-backdrop ${showSettings ? 'is-open' : ''}`}
        onClick={() => setShowSettings(false)}
      />

      <aside
        className={`settings-drawer ${showSettings ? 'is-open' : ''}`}
        role="dialog"
        aria-modal="true"
        aria-hidden={!showSettings}
      >
        <div className="drawer-scroll">
          <div className="drawer-header">
            <div>
              <p className="drawer-eyebrow">Control Panel</p>
              <h2 className="drawer-title">设置</h2>
            </div>

            <button
              type="button"
              className="drawer-close"
              onClick={() => setShowSettings(false)}
              aria-label="关闭设置"
            >
              [ Close ]
            </button>
          </div>

          <section className="setting-section">
            <h3 className="setting-title">Theme Presets</h3>
            <div className="theme-grid">
              {themePresets.map((theme) => (
                <button
                  key={theme.id}
                  type="button"
                  className={`theme-button ${activeTheme === theme.id ? 'is-active' : ''}`}
                  onClick={() => setActiveTheme(theme.id)}
                >
                  <span
                    className="theme-preview"
                    style={
                      {
                        '--preview-page': theme.previewPage,
                        '--preview-surface': theme.previewSurface,
                        '--preview-border': theme.previewBorder,
                        '--preview-ink': theme.previewInk,
                      } as CSSProperties
                    }
                  />

                  <span>
                    <span className="theme-name">{theme.name}</span>
                    <span className="theme-copy">{theme.copy}</span>
                  </span>

                  <span className="theme-mode">{theme.scheme}</span>
                </button>
              ))}
            </div>
          </section>

          <section className="setting-section">
            <h3 className="setting-title">Auto Cruise</h3>

            <div className="timing-row">
              {timeOptions.map((option) => (
                <button
                  key={option.label}
                  type="button"
                  className={`timing-chip ${intervalVal === option.value ? 'is-active' : ''}`}
                  onClick={() => setIntervalVal(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>

            {intervalVal === 'custom' && (
              <div className="custom-input-wrap">
                <input
                  type="number"
                  min={300}
                  step={100}
                  value={customMs}
                  onChange={(event) =>
                    setCustomMs(Number.parseInt(event.target.value, 10) || 0)
                  }
                />
                <span>ms</span>
              </div>
            )}

            <p className="current-interval">
              当前自动巡航间隔 {formatDuration(currentMs)}
            </p>
          </section>

          <section className="setting-section">
            <h3 className="setting-title">Item Pools</h3>

            <div className="pool-grid">
              {categories.map((category) => (
                <section key={category.id} className="pool-card">
                  <div className="pool-head">
                    <h3>{category.name}</h3>
                    <span className="pool-count">
                      {formatIndexToken(category.items.length)} ITEMS
                    </span>
                  </div>

                  <div className="chip-list">
                    {category.items.length > 0 ? (
                      category.items.map((item) => (
                        <span key={item} className="pool-chip">
                          {item}
                          <button
                            type="button"
                            className="chip-remove"
                            onClick={() => handleRemoveItem(category.id, item)}
                            aria-label={`删除 ${item}`}
                          >
                            ×
                          </button>
                        </span>
                      ))
                    ) : (
                      <span className="empty-hint">
                        当前词池为空，添加后即可参与抽取。
                      </span>
                    )}
                  </div>

                  <form
                    className="editor-row"
                    onSubmit={(event) => {
                      event.preventDefault();
                      handleAddItem(category.id);
                    }}
                  >
                    <input
                      type="text"
                      value={newItems[category.id] ?? ''}
                      onChange={(event) =>
                        setNewItems((previousItems) => ({
                          ...previousItems,
                          [category.id]: event.target.value,
                        }))
                      }
                      placeholder={`添加 ${category.name}`}
                    />
                    <button type="submit">Add</button>
                  </form>
                </section>
              ))}
            </div>
          </section>
        </div>
      </aside>
    </>
  );
}
