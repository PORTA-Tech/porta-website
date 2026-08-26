/** The evening email that lands at 11:30 pm. Yours alone. */
export default function DigestMail() {
  return (
    <div className="mail">
      <div className="mail-hd">
        <span className="sub">Thursday: 6h 40m, and the checkout is done</span>
        <span className="frm">Porta &lt;porta@useporta.com&gt; · to you</span>
      </div>
      <div className="mail-bd">
        <div className="mail-fig">
          <div>
            <span className="v num">6h 40m</span>
            <span className="l">Counted</span>
          </div>
          <div>
            <span className="v num">4h 55m</span>
            <span className="l">Focused</span>
          </div>
          <div>
            <span className="v num">1 of 2</span>
            <span className="l">Finished</span>
          </div>
        </div>
        <p>
          Your best stretch was 9:40 to 11:25, before anything else opened. Account settings
          went live on staging.
        </p>
        <p className="mail-note">
          Shipping rules has been blocked three weeks running. It's the only thing standing
          between this project and finished.
        </p>
      </div>
    </div>
  );
}
