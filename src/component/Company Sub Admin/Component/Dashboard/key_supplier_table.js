import React, { Component } from 'react';

export default class key_supplier_table extends Component {

    render() {
        return (
            <div>
                <table className="table">
                    <thead className="color_table">
                        <tr className="tom_color">
                            <th className="text_c" scope="col" style={{ width: '27%', padding: '13px 11px' }}>Supplier</th>
                            <th className="text_c" scope="col" style={{ width: '27%', padding: '13px 11px' }}>ESG Risk</th>
                            <th className="text_c" scope="col" style={{ width: '27%', padding: '13px 11px' }}>Source Risk</th>
                            <th className="text_c" scope="col" style={{ width: '27%', padding: '13px 11px' }}>Rating</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr className="tom_color">
                            <td className="Risk">Burson Auto Parts</td>
                            <td className="Risk">Responsible Sourcing</td>
                            <td className="Risk">Bloomberg</td>
                            <td className="Risk"><span className="loW_color">Low</span></td>
                        </tr>
                        <tr className="tom_color">
                            <td className="Risk">Super Retail Group</td>
                            <td className="Risk">Management</td>
                            <td className="Risk">CSR Hub</td>
                            <td className="Risk"><span className="loW_colorw">High</span></td>
                        </tr>
                        <tr className="tom_color">
                            <td className="Risk">Super Retail Group</td>
                            <td className="Risk">Modern Slavery</td>
                            <td className="Risk">Sustainalytics</td>
                            <td className="Risk"><span className="loW_colorq">Moderate</span></td>
                        </tr>
                    </tbody>
                </table>
            </div>
        )
    }
}           