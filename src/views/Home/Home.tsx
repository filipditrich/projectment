import React from 'react';

/**
 * Home Component
 * @author filipditrich
 */
export default class Home extends React.Component {

    render() {
        return (
            <>
                <h1>Welcome Home</h1>

                <div className="button-container">
                    <button className="button button-primary"><span>Primary</span></button >
                    <button className="button button-primary button-reverse"><span>Primary Reverse</span></button >
                    <button className="button button-secondary"><span>Secondary</span></button >
                    <button className="button button-secondary button-reverse"><span>Secondary Reverse</span></button >
                </div>
                <div className="button-container">
                    <button className="button button-danger"><span>Danger</span></button >
                    <button className="button button-danger button-reverse"><span>Danger Reverse</span></button >
                    <button className="button button-warning"><span>Warning</span></button >
                    <button className="button button-warning button-reverse"><span>Warning Reverse</span></button >
                </div>
                <div className="button-container">
                    <button className="button button-info"><span>Info</span></button >
                    <button className="button button-info button-reverse"><span>Info Reverse</span></button >
                    <button className="button button-success"><span>Success</span></button >
                    <button className="button button-success button-reverse"><span>Success Reverse</span></button >
                </div>

            </>
        );
    }
}
